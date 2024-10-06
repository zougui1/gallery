import { type PostQueueSchemaWithId, type PostSchemaWithId } from '@zougui/gallery.database';

import { DB } from '~/server/database';
import { PostQueueStatus } from '~/enums';

export const checkDuplicates = async (postQueue: PostQueueSchemaWithId, checksum: string): Promise<PostSchemaWithId | undefined> => {
  await DB.postQueue.findByIdAndUpdate(postQueue._id, {
    $push: {
      steps: {
        date: new Date(),
        status: PostQueueStatus.checkingDuplicates,
      },
    },
  });

  const duplicatePost = await DB.post.model.findOne({
    'file.checksum': checksum,
  }).lean();

  if (duplicatePost) {
    return DB.post.deserialize(duplicatePost);
  }
}
