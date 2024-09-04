import { PostQueueStatus } from '~/enums';
import { DB, type PostQueueSchemaWithId } from '~/server/database';

import { processPostQueue } from './processPostQueue';

export const restartProcessPostQueue = async (post: PostQueueSchemaWithId): Promise<void> => {
  await DB.postQueue.addStep(post._id, {
    date: new Date(),
    status: PostQueueStatus.restarted,
    message: 'The processing of the post has been manually restarted',
  });

  await processPostQueue(post, { updatePost: true });
}
