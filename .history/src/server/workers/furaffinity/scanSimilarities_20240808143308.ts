import leven from 'fast-levenshtein';
import { nanoid } from 'nanoid';

import {
  DB,
  type PostSchemaWithId,
} from '~/server/database';
import { PostQueueStatus } from '~/enums';
import type { PostQueueSchemaWithId } from '~/server/database/post-queue';

const findSimilarPost = async (newPost: PostSchemaWithId): Promise<PostSchemaWithId | undefined> => {
  const exactMatch = await DB.post.query.model.findOne({
    _id: {
      $ne: newPost._id,
    },

    'file.hash': newPost.file.hash,
  }).lean();

  if (exactMatch) {
    return DB.post.query.deserialize(exactMatch);
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
      return DB.post.query.deserialize(document);
    }
  }
}

export const scanSimilarities = async (postQueue: PostQueueSchemaWithId, post: PostSchemaWithId): Promise<void> => {
  await DB.postQueue.query.addStep(postQueue._id, {
    date: new Date(),
    status: PostQueueStatus.scanningSimilarities,
  });

  // there is no scan to do if no hash
  if (!post.file.hash) {
    return;
  }

  const similarPost = await findSimilarPost(post);

  if (!similarPost) {
    return;
  }

  const similarityId = similarPost.similarity?.id ?? nanoid();
  const documentIdsToUpdate = [post._id];

  if (!similarPost.similarity) {
    documentIdsToUpdate.push(similarPost._id);
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
