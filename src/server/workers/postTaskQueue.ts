import { TaskQueue } from '~/utils';

import { processPostQueue } from './processPostQueue';
import { DB, type PostQueueSchemaWithId } from '../database';

class PostTaskQueue extends TaskQueue<PostQueueSchemaWithId> {
  findBusy = async (): Promise<PostQueueSchemaWithId | undefined> => {
    return await DB.postQueue.findOneBusy();
  }

  findIdle = async (): Promise<PostQueueSchemaWithId | undefined> => {
    return await DB.postQueue.findOneIdle();
  }

  process = async (post: PostQueueSchemaWithId): Promise<void> => {
    await processPostQueue(post);
  }
}

export const postTaskQueue = new PostTaskQueue();
