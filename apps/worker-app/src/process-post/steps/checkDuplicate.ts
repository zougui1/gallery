import { PostQueueStatus } from '@zougui/gallery.enums';

import { DB, type PostQueueSchemaWithId, type PostSchemaWithId } from '../../database';

export const checkDuplicate = async (postQueue: PostQueueSchemaWithId, uniqueHash: string): Promise<PostSchemaWithId | null> => {
  try {
    await DB.postQueue.findByIdAndUpdate(postQueue._id, {
      $push: {
        steps: {
          date: new Date(),
          status: PostQueueStatus.checkingDuplicates,
        },
      },
    });

    return await DB.post.findOne({
      'file.checksum': uniqueHash,
      sourceUrl: { $ne: postQueue.url },
    });
  } catch (error) {
    throw new Error('An error occured while checking post for duplicate', { cause: error });
  }
}
