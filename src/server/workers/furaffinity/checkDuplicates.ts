import { DB, type PostSchemaWithId } from '~/server/database';
import { PostQueueStatus } from '~/enums';
import type { PostQueueSchemaWithId } from '~/server/database/post-queue';

export const checkDuplicates = async (postQueue: PostQueueSchemaWithId, checksum: string): Promise<PostSchemaWithId | undefined> => {
  await DB.postQueue.query.addStep(postQueue._id, {
    date: new Date(),
    status: PostQueueStatus.checkingDuplicates,
  });

  const duplicatePost = await DB.post.query.model.findOne({
    'file.checksum': checksum,
  }).lean();

  if (duplicatePost) {
    return DB.post.query.deserialize(duplicatePost);
  }
}
