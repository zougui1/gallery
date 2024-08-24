import { FurAffinityClient } from '@zougui/furaffinity';

import { PostQueueStatus } from '~/enums';

import { processFuraffinityPostQueue } from './furaffinity';
import { busyStatuses } from './busyStatuses';
import { DB, type PostQueueSchemaWithId } from '../database';
import { getErrorMessage } from '~/utils';

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
  if ('series' in post) {
    console.log('Process:', post.series?.chapterIndex, post.series?.partIndex)
  }

  await checkForRestart(post);

  try {
    if ('url' in post) {
      const existingPost = await DB.post.query.findBySourceUrl(post.url);

      if (existingPost) {
        await DB.postQueue.query.addStep(post._id, {
          date: new Date(),
          status: PostQueueStatus.error,
          message: 'This url already been uploaded',
        });
        return;
      }

      if (FurAffinityClient.URL.checkIsValidHostName(post.url)) {
        return await processFuraffinityPostQueue(post);
      }

      // TODO process unknown URL upload
    }

    // TODO process file upload
  } catch (error) {
    console.error(error);
    await DB.postQueue.query.addStep(post._id, {
      date: new Date(),
      status: PostQueueStatus.error,
      message: getErrorMessage(error, 'An unknown error has occured'),
    });
  } finally {
    process.exit();
  }
}
