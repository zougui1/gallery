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

export const processFuraffinityPostQueue = async (post: WithId<FuraffinityUrlUploadPostQueueSchema>) => {
  const [fetchError, submission] = await tryStep(fetchData, post, 'An error occured while fetching submission data')(post);

  if (fetchError) {
    console.error(fetchError);
    return;
  }

  if (!submission) {
    await DB.postQueue.query.addStep(post._id, {
      date: new Date(),
      status: PostQueueStatus.error,
      message: 'Submission not found',
    });

    return;
  }

  const [downloadError, files] = await tryStep(downloadContent, post, 'An error occured while downloading the submission files')(post, submission);

  if (downloadError) {
    console.error(downloadError);
    return;
  }

  const [processError, result] = await tryStep(processFiles, post, 'An error occured while processing the submission')({
    post,
    files,
  });

  if (processError) {
    console.error(processError);
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

    if (similar.hashDistance === 0) {
      const sizeMatch = 'width' in result.file && {
        'file.width': result.file.width,
        'file.height': result.file.height,
      };

      const similarPosts = await DB.post.query.model
        .find({
          _id: {
            $ne: newPostDocument._id,
          },
          similarity: {
            id: similarityId,
          },
          ...(sizeMatch ?? {}),
        }).lean();

      const results = await parallel(similarPosts.length, similarPosts, async similarPost => {
        const identical = await checkIdentical(newPostDocument, similar.post);

        return {
          post: similarPost,
          identical,
        };
      });
      const isDuplicate = results.some(result => result.identical);

      // TODO do this identical check right after the findOne on hash only
      // TODO and do it before adding this new post to the collection 'posts'
      // TODO delete newPostDocument
    }
  }

  //console.log('submission', submission);
}

const checkIdentical = async (postA: PostSchemaWithId, postB: PostSchemaWithId): Promise<boolean> => {
  const [imageA, imageB] = await Promise.all([
    sharp(path.join(env.CONTENT_DIR, postA.file.fileName))
      .raw()
      .ensureAlpha()
      .toBuffer(),
    sharp(path.join(env.CONTENT_DIR, postB.file.fileName))
      .raw()
      .ensureAlpha()
      .toBuffer(),
  ]);

  if (imageA.length !== imageB.length) {
    return false;
  }

  return imageA.every((pixelColor, index) => pixelColor === imageB[index]);
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
