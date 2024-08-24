import type { FuraffinityUrlUploadPostQueueSchema, WithId } from '~/server/database';

import { fetchData } from './fetchData';

export const processFuraffinityPostQueue = async (post: WithId<FuraffinityUrlUploadPostQueueSchema>) => {
  await fetchData(post);
}
