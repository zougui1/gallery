import { FuraffinityClient } from '@zougui/furaffinity';

import { env } from '~/env';

import { processFuraffinityPostQueue } from './furaffinity';
import {
  DB,
  type PostQueueSchema,
  type FileUploadPostQueueSchema,
  type FuraffinityUrlUploadPostQueueSchema,
  type UnknownUrlUploadPostQueueSchema,
  type WithId,
} from '../database';

const furaffinity = new FuraffinityClient({
  cookieA: env.FURAFFINITY_COOKIE_A,
  cookieB: env.FURAFFINITY_COOKIE_B,
});

export const processPostQueue = async (post: WithId<PostQueueSchema>) => {
  if ('url' in post) {
    await processFuraffinityPostQueue(post);
  }
}
