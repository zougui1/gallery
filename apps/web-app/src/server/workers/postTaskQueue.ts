import { TaskQueue } from '~/utils';

import { processPostQueue } from './processPostQueue';
import { busyStatuses } from './busyStatuses';
import { DB, type PostQueueSchemaWithId } from '../database';

class PostTaskQueue extends TaskQueue<PostQueueSchemaWithId> {
  findBusy = async (): Promise<PostQueueSchemaWithId | undefined> => {
    const [postQueue] = await DB.postQueue
      .aggregate<PostQueueSchemaWithId>()
      .addFields({
        lastStep: {
          $last: '$steps',
        },
      })
      .match({
        'lastStep.status': {
          $in: busyStatuses,
        },
      })
      .limit(1)
      .project({
        lastStep: 0,
      });

    return postQueue;
  }

  findIdle = async (): Promise<PostQueueSchemaWithId | undefined> => {
    const [postQueue] = await DB.postQueue
      .aggregate<PostQueueSchemaWithId>()
      .match({
        'steps.0': {
          $exists: false,
        },
      })
      .sort({
        createdAt: 1,
      })
      .limit(1);

    return postQueue;
  }

  process = async (post: PostQueueSchemaWithId): Promise<void> => {
    await processPostQueue(post);
  }
}

export const postTaskQueue = new PostTaskQueue();
