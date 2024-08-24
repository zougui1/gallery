import { type Submission } from '@zougui/furaffinity';

import { DB, type FuraffinityUrlUploadPostQueueSchema, type WithId } from '~/server/database';
import { PostQueueStatus, PostType } from '~/enums';

import { client } from './client'

export const fetchData = async (post: WithId<FuraffinityUrlUploadPostQueueSchema>): Promise<Submission | undefined> => {
  await DB.postQueue.query.addStep(post._id, {
    date: new Date(),
    status: PostQueueStatus.fetchingData,
  });

  const submission = await client.submission.findOne(post.url);

  if (!Object.values(PostType as unknown as string).includes(submission.type)) {
    throw new Error(`You cannot upload a submission of type: ${submission.type}`);
  }

  return submission;
}
