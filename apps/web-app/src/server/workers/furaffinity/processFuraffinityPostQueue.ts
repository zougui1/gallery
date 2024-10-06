import path from 'node:path';

import { tryit } from 'radash';
import fs from 'fs-extra';

import type { Submission } from '@zougui/furaffinity';

import {
  DB,
  type PostQueueSchema,
  type WithId,
} from '~/server/database';
import { PostQueueStatus, PostRating, PostType } from '~/enums';
import { getErrorMessage } from '~/utils';
import { env } from '~/env';

import { fetchData } from './fetchData';
import { downloadContent } from './downloadContent';
import { processFiles } from './processFiles';
import { scanSimilarities } from './scanSimilarities';
import { checkDuplicates } from './checkDuplicates';
import { type FileTypeResult, type ProcessPostQueueOptions } from '../types';

type TryStepResult<T> = (
  | [error: undefined, result: T]
  | [error: Error, result: undefined]
);

const mapType: Partial<Record<FileTypeResult['mime'], PostType>> = {
  'image/avif': PostType.image,
  'image/bmp': PostType.image,
  'image/jp2': PostType.image,
  'image/jpeg': PostType.image,
  'image/jpx': PostType.image,
  'image/png': PostType.image,
  'image/webp': PostType.image,

  'text/plain': PostType.story,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': PostType.story,
  'application/pdf': PostType.story,
  'application/rtf': PostType.story,
  'application/vnd.oasis.opendocument.text': PostType.story,
  'application/vnd.oasis.opendocument.presentation': PostType.story,
  'application/vnd.oasis.opendocument.spreadsheet': PostType.story,

  'image/gif': PostType.animation,
  'image/apng': PostType.animation,
  'video/mp4': PostType.animation,
  'video/mpeg': PostType.animation,
  'video/ogg': PostType.animation,
  'video/vnd.avi': PostType.animation,
  'video/webm': PostType.animation,
  'video/x-flv': PostType.animation,
  'video/x-m4v': PostType.animation,

  /*'audio/aac': PostType.music,
  'audio/aiff': PostType.music,
  'audio/midi': PostType.music,
  'audio/mp4': PostType.music,
  'audio/mpeg': PostType.music,
  'audio/ogg': PostType.music,
  'audio/opus': PostType.music,
  'audio/wav': PostType.music,
  'audio/x-m4a': PostType.music,

  'application/x-shockwave-flash': PostType.flash,*/
};

const mapRating: Record<Submission['rating'], PostRating> = {
  General: PostRating.sfw,
  Mature: PostRating.nsfw,
  Adult: PostRating.nsfw,
};

const tryStep = <Args extends unknown[], Return>(
  func: (...args: Args) => Promise<Return>,
  post: WithId<PostQueueSchema>,
  defaultErrorMessage: string
) => {
  return async (...args: Args): Promise<TryStepResult<Return>> => {
    const res = await tryit(func)(...args);
    const [error] = res;

    if (error) {
      await DB.postQueue.findByIdAndUpdate(post._id, {
        $push: {
          steps: {
            date: new Date(),
            status: PostQueueStatus.error,
            message: getErrorMessage(error, defaultErrorMessage),
          },
        },
      });
    }

    return res;
  }
}

export const processFuraffinityPostQueue = async (postQueue: WithId<PostQueueSchema>, options?: ProcessPostQueueOptions) => {
  const [fetchError, submission] = await tryStep(fetchData, postQueue, 'An error occured while fetching submission data')(postQueue);

  if (fetchError) {
    console.error(fetchError);
    return;
  }

  if (!submission) {
    await DB.postQueue.findByIdAndUpdate(postQueue._id, {
      $push: {
        steps: {
          date: new Date(),
          status: PostQueueStatus.error,
          message: 'Submission not found',
        },
      },
    });

    return;
  }

  const [downloadError, files] = await tryStep(downloadContent, postQueue, 'An error occured while downloading the submission files')(postQueue, submission);

  if (downloadError) {
    console.error(downloadError);
    return;
  }

  const [processError, result] = await tryStep(processFiles, postQueue, 'An error occured while processing the submission')({
    post: postQueue,
    files,
  });

  if (processError) {
    console.error(processError);
    return;
  }

  const { checksum } = result.file;

  // check for identical checksum only if we don't want to actually update the post
  if (checksum && !options?.updatePost) {
    const [checkError, duplicatePost] = await tryStep(checkDuplicates, postQueue, 'An error occured while checking submissions for duplicates')(
      postQueue,
      checksum,
    );

    if (checkError) {
      console.error(checkError);
      return;
    }

    if (duplicatePost) {
      await DB.postQueue.findByIdAndUpdate(postQueue._id, {
        $push: {
          steps: {
            date: new Date(),
            status: PostQueueStatus.ignored,
            message: `Duplicate of ${duplicatePost._id.toString()}`,
          },
        },
      });
      return;
    }
  }

  const postData = {
    alt: postQueue.alt,
    series: postQueue.series,
    sourceUrl: submission.url,
    title: postQueue.title.toLowerCase() === 'untitled' ? submission.title : postQueue.title,
    contentType: mapType[files.content.mime] ?? PostType.unknown,
    rating: mapRating[submission.rating],
    description: postQueue.description ?? submission.descriptionText,
    keywords: postQueue.keywords.length ? postQueue.keywords : submission.keywords,
    author: submission.author,
    file: {
      ...result.file,
      fileName: path.basename(files.content.path),
      contentType: files.content.mime,
    },

    thumbnail: {
      original: {
        ...result.originalThumbnail,
        fileName: path.basename(files.thumbnail.path),
        contentType: files.thumbnail.mime,
      },

      small: {
        ...result.smallThumbnail,
        fileName: path.basename(result.smallThumbnail.path),
        contentType: result.smallThumbnail.mime,
      },
    },

    attachment: (postQueue.attachmentUrl && files.attachment && result.attachment) ? {
      ...result.attachment,
      sourceUrl: postQueue.attachmentUrl,
      fileName: path.basename(files.attachment.path),
      contentType: files.attachment.mime,
    } : undefined,

    postedAt: submission.postedAt,
    createdAt: new Date(),

    originalData: submission,
  };

  const existingPost = await DB.post.findOne({ sourceUrl: postQueue.url });
  const updatedPost = existingPost && await DB.post.findByIdAndUpdate(
    existingPost._id,
    DB.post.schema.post.parse(postData),
  );
  const newPost = updatedPost ?? await DB.post.createOne(postData);

  if (existingPost) {
    await Promise.allSettled([
      fs.remove(path.join(env.CONTENT_DIR, existingPost.file.fileName)),
      fs.remove(path.join(env.CONTENT_DIR, existingPost.thumbnail.original.fileName)),
      fs.remove(path.join(env.CONTENT_DIR, existingPost.thumbnail.small.fileName)),
      existingPost.attachment && fs.remove(path.join(env.CONTENT_DIR, existingPost.attachment.fileName)),
    ]);
  }

  // there is no scan to do if no hash
  if (newPost.file.hash) {
    const [scanError] = await tryStep(scanSimilarities, postQueue, 'An error occured while scanning the submissions')(
      postQueue,
      newPost,
    );

    if (scanError) {
      console.error(scanError);
      return;
    }
  }

  await DB.postQueue.findByIdAndUpdate(postQueue._id, {
    $push: {
      steps: {
        date: new Date(),
        status: PostQueueStatus.complete,
      },
    },
  });
}
