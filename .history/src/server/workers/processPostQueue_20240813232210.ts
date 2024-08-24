import { FurAffinityClient } from '@zougui/furaffinity';

import { PostQueueStatus } from '~/enums';

import { processFuraffinityPostQueue } from './furaffinity';
import { busyStatuses } from './busyStatuses';
import { DB, type PostQueueSchemaWithId } from '../database';

const checkForRestart = async (postQueue: PostQueueSchemaWithId): Promise<void> => {
  const lastStep = postQueue.steps[postQueue.steps.length - 1];

  if (!lastStep) {
    return;
  }

  // ignore the post, it has already been processed
  if (!busyStatuses.includes(lastStep.status)) {
    return;
  }

  await DB.postQueue.query.addStep(postQueue._id, {
    date: new Date(),
    status: PostQueueStatus.restarted,
    message: 'The server restarted before it could finish processing the post',
  });
}

export const processPostQueue = async (post: PostQueueSchemaWithId) => {
  await checkForRestart(post);

  if ('url' in post) {
    if (FurAffinityClient.URL.checkIsValidHostName(post.url)) {
      return await processFuraffinityPostQueue(post);
    }

    // TODO process unknown URL upload
  }

  // TODO process file upload
}
