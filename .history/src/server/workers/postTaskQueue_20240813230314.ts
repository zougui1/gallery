import { TaskQueue } from '~/utils';

import { processPostQueue } from './processPostQueue';
import { DB, type PostQueueSchema } from '../database';

class PostTaskQueue extends TaskQueue<PostQueueSchema> {
  findBusy = async (): Promise<PostQueueSchema | undefined> => {
    return await DB.postQueue.query.findOneBusy();
  }

  findIdle = async (): Promise<PostQueueSchema | undefined> => {
    return await DB.postQueue.query.findOneIdle();
  }

  process = async (post: PostQueueSchema): Promise<void> => {
    await processPostQueue(post);
  }
}

export const postTaskQueue = new PostTaskQueue();
