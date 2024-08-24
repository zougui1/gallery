import { DB, type FuraffinityUrlUploadPostQueueSchema, type WithId } from '~/server/database';
import { PostQueueStatus } from '~/enums';

import { client } from './client'

export const fetchData = async (post: WithId<FuraffinityUrlUploadPostQueueSchema>) => {
  await DB.postQueue.query.addStep(post._id, {
    date: new Date(),
    status: PostQueueStatus.fetchingData,
  });

  const id = client.extractSubmissionId(post.url);
}
