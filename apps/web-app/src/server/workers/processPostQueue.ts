import { FurAffinityClient } from '@zougui/furaffinity';
import { PostQueueStatus } from '@zougui/gallery.enums';

import { getErrorMessage } from '~/utils';

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

  await DB.postQueue.findByIdAndUpdate(postQueue._id, {
    $push: {
      steps: {
        date: new Date(),
        status: PostQueueStatus.restarted,
        message: 'The server restarted before it could finish processing the post',
      },
    },
  });
}

export const processPostQueue = async (post: PostQueueSchemaWithId) => {
  const lastStatus = post.steps[post.steps.length - 1]?.status;

  await checkForRestart(post);

  try {
    if (FurAffinityClient.URL.checkIsValidHostName(post.url)) {
      return await processFuraffinityPostQueue(post, {
        updatePost: lastStatus === PostQueueStatus.restarted,
      });
    }

    // TODO process unknown URL upload
  } catch (error) {
    console.error(error);
    await DB.postQueue.findByIdAndUpdate(post._id, {
      $push: {
        steps: {
          date: new Date(),
          status: PostQueueStatus.error,
          message: getErrorMessage(error, 'An unknown error has occured'),
        },
      },
    });
  }
}
