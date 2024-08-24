import { type Submission } from '@zougui/furaffinity';

import { DB, type PostQueueSchema, type WithId } from '~/server/database';
import { PostQueueStatus } from '~/enums';

import { client } from './client'

export const fetchData = async (post: WithId<PostQueueSchema>): Promise<Submission | undefined> => {
  await DB.postQueue.query.addStep(post._id, {
    date: new Date(),
    status: PostQueueStatus.fetchingData,
  });

  return await client.submission.findOne(post.url);
}
