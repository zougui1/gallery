import { PostQueueStatus, busyStatuses } from '@zougui/gallery.enums';

import { DB, type PostQueueSchemaWithId } from '../database';

export const checkUnexpectedRestart = async (postQueue: PostQueueSchemaWithId): Promise<void> => {
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
