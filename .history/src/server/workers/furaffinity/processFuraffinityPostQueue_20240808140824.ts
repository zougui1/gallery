import path from 'node:path';

import { parallel, tryit } from 'radash';
import leven from 'fast-levenshtein';

import type { Submission } from '@zougui/furaffinity';

import {
  DB,
  type PostSchemaWithId,
  type FuraffinityUrlUploadPostQueueSchema,
  type WithId,
} from '~/server/database';
import { PostQueueStatus, PostType } from '~/enums';
import { getErrorMessage } from '~/utils';

import { fetchData } from './fetchData';
import { downloadContent } from './downloadContent';
import { processFiles } from './processFiles';
import { nanoid } from 'nanoid';
import { env } from '~/env';
import sharp from 'sharp';

type TryStepResult<T> = (
  | [error: undefined, result: T]
  | [error: Error, result: undefined]
);

const mapType: Record<Submission['type'], PostType> = {
  image: PostType.art,
  story: PostType.story,
  music: PostType.music,
  flash: PostType.flash,
  unknown: PostType.unknown,
};

const tryStep = <Args extends unknown[], Return>(
  func: (...args: Args) => Promise<Return>,
  post: WithId<FuraffinityUrlUploadPostQueueSchema>,
  defaultErrorMessage: string
) => {
  return async (...args: Args): Promise<TryStepResult<Return>> => {
    const res = await tryit(func)(...args);
    const [error] = res;

    if (error) {
      await DB.postQueue.query.addStep(post._id, {
        date: new Date(),
        status: PostQueueStatus.error,
        message: getErrorMessage(error, defaultErrorMessage),
      });
    }

    return res;
  }
}

export const processFuraffinityPostQueue = async (postQueue: WithId<FuraffinityUrlUploadPostQueueSchema>) => {
  const [fetchError, submission] = await tryStep(fetchData, postQueue, 'An error occured while fetching submission data')(postQueue);

  if (fetchError) {
    console.error(fetchError);
    return;
  }

  if (!submission) {
    await DB.postQueue.query.addStep(postQueue._id, {
      date: new Date(),
      status: PostQueueStatus.error,
      message: 'Submission not found',
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

  const duplicatePost = await DB.post.query.model.findOne({
    'file.checksum': result.file.checksum,
  }).lean();

  if (duplicatePost) {
    await DB.postQueue.query.addStep(postQueue._id, {
      date: new Date(),
      status: PostQueueStatus.ignored,
      message: `Duplicate of ${duplicatePost._id.toString()}`,
    });
    return;
  }

  const newPostDocument = await DB.post.query.create({
    sourceUrl: submission.url,
    title: submission.title,
    contentType: mapType[submission.type],
    description: submission.descriptionText,
    keywords: submission.keywords,
    author: submission.author,
    file: {
      ...result.file,
      fileName: path.basename(files.content.path),
      contentType: files.content.mime,
    },

    thumbnail: {
      original: {
        fileName: path.basename(files.thumbnail.path),
        contentType: files.thumbnail.mime,
      },

      small: {
        fileName: path.basename(result.smallThumbnail.path),
        contentType: result.smallThumbnail.mime,
      },
    },

    postedAt: submission.postedAt,
    createdAt: new Date(),

    originalData: submission,
  });

  // there is no scan to do if no hash
  if (!newPostDocument.file.hash) {
    return;
  }

  // TODO if success then add the post to the collection 'posts'
  //* scanning:
  //*   - exact match on the file hash
  //*   - cursor through the collection (order by _id in ASC order) for a distance match (distance threshold: 6)
  //* if either of those match, match against the images' pixels to automatically delete guaranteed duplicates

  const similar = await findSimilarPost(newPostDocument);

  if (similar) {
    const similarityId = similar.post.similarity?.id ?? nanoid();
    const documentIdsToUpdate = [newPostDocument._id];

    if (!similar.post.similarity) {
      documentIdsToUpdate.push(similar.post._id);
    }

    await DB.post.query.model.updateMany(
      {
        _id: {
          $in: documentIdsToUpdate,
        },
      },
      {
        similarity: { id: similarityId },
      },
    );
  }

  //console.log('submission', submission);
}

const findSimilarPost = async (newPost: PostSchemaWithId): Promise<{ post: PostSchemaWithId; hashDistance: number } | undefined> => {
  const exactMatch = await DB.post.query.model.findOne({
    _id: {
      $ne: newPost._id,
    },

    'file.hash': newPost.file.hash,
  }).lean();

  if (exactMatch) {
    return {
      post: DB.post.query.deserialize(exactMatch),
      hashDistance: 0,
    };
  }

  const cursor = DB.post.query.model
    .find({
      _id: {
        $ne: newPost._id,
      },

      'file.hash': {
        $ne: null,
      },

      contentType: newPost.contentType,
    })
    .sort({ _id: 1 })
    .cursor();

  for await (const document of cursor) {
    if (!document.file.hash || !newPost.file.hash) {
      continue;
    }

    const hashDistance = leven.get(newPost.file.hash, document.file.hash);

    if (hashDistance <= 6) {
      return {
        post: DB.post.query.deserialize(document),
        hashDistance,
      };
    }
  }
}
