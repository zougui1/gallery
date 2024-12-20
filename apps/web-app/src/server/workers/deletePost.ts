import path from 'node:path';

import fs from 'fs-extra';

import { PostQueueStatus } from '~/enums';
import { env } from '~/env';

import { DB, type PostQueueSchemaWithId } from '../database';
import { getErrorMessage } from '~/utils';

const deleteFile = async (fileName: string, label: string): Promise<void> => {
  try {
    await fs.remove(path.join(env.CONTENT_DIR, fileName));
  } catch (error) {
    throw new Error(`Could not delete the ${label} file`, { cause: error });
  }
}

export const deletePost = async (postQueue: PostQueueSchemaWithId): Promise<void> => {
  await DB.postQueue.findByIdAndUpdate(postQueue._id, {
    $push: {
      steps: {
        status: PostQueueStatus.deleting,
        date: new Date(),
      },
    },
  });

  const post = await DB.post.findOne({ sourceUrl: postQueue.url });

  if (!post) {
    await DB.postQueue.findByIdAndUpdate(postQueue._id, {
      $push: {
        steps: {
          status: PostQueueStatus.error,
          date: new Date(),
          message: 'Cannot delete the post: entry not found in the database',
        },
      },
    });
    return;
  }

  const results = await Promise.allSettled([
    deleteFile(post.file.fileName, 'content'),
    deleteFile(post.thumbnail.original.fileName, 'original thumbnail'),
    deleteFile(post.thumbnail.small.fileName, 'small thumbnail'),
    post.attachment && deleteFile(post.attachment.fileName, 'attachment'),
  ]);

  const errors: string[] = [];

  for (const result of results) {
    if (result.status === 'rejected') {
      const error = getErrorMessage(result.reason, {
        withCause: cause => getErrorMessage(cause)?.split(',')[0],
      });

      if (error) {
        errors.push(error);
      }
    }
  }

  const hasDeletionSucceeded = results.every(result => result.status === 'fulfilled');

  if (!hasDeletionSucceeded) {
    await DB.postQueue.findByIdAndUpdate(postQueue._id, {
      $push: {
        steps: {
          status: PostQueueStatus.error,
          date: new Date(),
          message: 'An error occurred while deleting the post\'s files',
          errorList: errors,
        },
      },
    });
    return;
  }

  try {
    await DB.post.findByIdAndDelete(post._id);
  } catch (error) {
    await DB.postQueue.findByIdAndUpdate(postQueue._id, {
      $push: {
        steps: {
          status: PostQueueStatus.error,
          date: new Date(),
          message: 'The post\'s files have been deleted but an error occurred while deleting the post\'s data from the database',
          errorList: errors,
        },
      },
    });
    return;
  }

  // TODO log errors
  await Promise.allSettled([
    DB.postQueue.findByIdAndUpdate(postQueue._id, {
      $push: {
        steps: {
          status: PostQueueStatus.deleted,
          date: new Date(),
        },
      },
    }),
    post.alt && updateLastRemainingAlt(post.alt.id),
  ]);
}

const updateLastRemainingAlt = async (altId: string): Promise<void> => {
  const altPosts = await DB.post.find({ 'alt.id': { $in: [altId] } });

  // if there is only 1 alt remaining then we remove its alt metadata as it becomes obsolete
  if (altPosts.length === 1) {
    await DB.post.updateOne({ _id: altPosts[0]!._id }, { $unset: { alt: 1 } });
  }
}
