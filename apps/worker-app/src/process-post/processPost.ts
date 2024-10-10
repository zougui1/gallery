import path from 'node:path';

import { tryit } from 'radash';
import fs from 'fs-extra';
import { z } from 'zod';

import { PostQueueStatus, PostRating, PostType } from '@zougui/gallery.enums';
import { Submission } from '@zougui/furaffinity';

import { checkUnexpectedRestart } from './checkUnexpectedRestart';
import { fetchData, downloadContent, processFiles, checkDuplicate } from './steps';
import { DB } from '../database';
import { FileTypeResult, getErrorMessage } from '../utils';
import { env } from '../env';

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

const schema = z.object({
  postQueueId: z.string(),
});

export const processPost = async (data: unknown): Promise<void> => {
  const { postQueueId: id } = schema.parse(data);
  const [error, postQueue] = await tryit(DB.postQueue.findById)(id);

  if (error) {
    // TODO log
  }

  if (!postQueue) {
    return;
  }

  try {
    await checkUnexpectedRestart(postQueue);

    const post = await fetchData(postQueue);
    const files = await downloadContent(postQueue, post);
    const processResult = await processFiles(postQueue, files);

    if (processResult.file.uniqueHash) {
      const duplicatePost = await checkDuplicate(postQueue, processResult.file.uniqueHash);

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

    // TODO allow posts to not have a thumbnail
    if (!files.thumbnail || !processResult.originalThumbnail || !processResult.smallThumbnail) {
      throw new Error('The post is missing a thumbnail');
    }

    const postData = {
      alt: postQueue.alt,
      series: postQueue.series,
      sourceUrl: post.url,
      title: postQueue.title.toLowerCase() === 'untitled' ? post.title : postQueue.title,
      contentType: mapType[files.content.mime] ?? PostType.unknown,
      rating: mapRating[post.rating],
      description: postQueue.description ?? post.descriptionText,
      keywords: postQueue.keywords.length ? postQueue.keywords : post.keywords,
      author: post.author,
      file: {
        ...processResult.file,
        fileName: path.basename(files.content.path),
        contentType: files.content.mime,
      },

      thumbnail: {
        original: {
          ...processResult.originalThumbnail,
          fileName: path.basename(files.thumbnail.path),
          contentType: files.thumbnail.mime,
        },

        small: {
          ...processResult.smallThumbnail,
          fileName: path.basename(processResult.smallThumbnail.path),
          contentType: processResult.smallThumbnail.mime,
        },
      },

      attachment: (postQueue.attachmentUrl && files.attachment && processResult.attachment) ? {
        ...processResult.attachment,
        sourceUrl: postQueue.attachmentUrl,
        fileName: path.basename(files.attachment.path),
        contentType: files.attachment.mime,
      } : undefined,

      postedAt: post.postedAt,
      createdAt: new Date(),

      originalData: post,
      persisted: false,
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

    await DB.postQueue.findByIdAndUpdate(postQueue._id, {
      $push: {
        steps: {
          date: new Date(),
          status: PostQueueStatus.complete,
        },
      },
    });
  } catch (error) {
    // TODO log error
    await DB.postQueue.findByIdAndUpdate(postQueue._id, {
      $push: {
        steps: {
          date: new Date(),
          status: PostQueueStatus.error,
          message: getErrorMessage(error, 'An error occured while trying to process the post'),
        },
      },
    });
  }
}
