import { tryit } from 'radash';

import {
  DB,
  type FuraffinityUrlUploadPostQueueSchema,
  type WithId,
} from '~/server/database';
import { PostQueueStatus } from '~/enums';
import { getErrorMessage } from '~/utils';

import { fetchData } from './fetchData';
import { downloadContent } from './downloadContent';
import { processFiles } from './processFiles';

type TryStepResult<T> = (
  | [error: undefined, result: T]
  | [error: Error, result: undefined]
)

const tryStep = <Args extends unknown[], Return>(
  func: (...args: Args) => Promise<Return>,
  post: WithId<FuraffinityUrlUploadPostQueueSchema>,
  defaultErrorMessage: string
) => {
  return async (...args: Args): Promise<TryStepResult<Return>> => {
    const res = await tryit(func)(...args);
    const [error] = res;

    if (error) {
      await DB.postQueue.query.addStep(post._id, {
        date: new Date(),
        status: PostQueueStatus.error,
        message: getErrorMessage(error, defaultErrorMessage),
      });
    }

    return res;
  }
}

export const processFuraffinityPostQueue = async (post: WithId<FuraffinityUrlUploadPostQueueSchema>) => {
  const [fetchError, submission] = await tryStep(fetchData, post, 'An error occured while fetching submission data')(post);

  if (fetchError) {
    return;
  }

  if (!submission) {
    await DB.postQueue.query.addStep(post._id, {
      date: new Date(),
      status: PostQueueStatus.error,
      message: 'Submission not found',
    });

    return;
  }

  const [downloadError, files] = await tryStep(downloadContent, post, 'An error occured while downloading the submission files')(post, submission);

  if (downloadError) {
    return;
  }

  await tryStep(processFiles, post, 'An error occured while processing the submission')({
    post,
    files,
  });

  // TODO if success then add the post to the collection 'posts'
  //* scanning:
  //*   - exact match on the file hash
  //*   - cursor through the collection (order by _id in ASC order) for a distance match (distance threshold: 6)
  //* if either of those match, match against the images' pixels to automatically delete guaranteed duplicates

  //console.log('submission', submission);
}
