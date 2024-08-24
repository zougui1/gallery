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
  const [error, submission] = await tryStep(fetchData, post, 'An error occured while fetching submission data')(post);

  if (error) {
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

  await downloadContent(post, submission);
  // TODO download content and thumbnail
  // TODO process content and thumbnail

  console.log('submission', submission);
}
