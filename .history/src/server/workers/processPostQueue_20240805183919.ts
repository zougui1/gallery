import { FuraffinityClient } from '@zougui/furaffinity';

import { env } from '~/env';

import {
  DB,
  type PostQueueSchema,
  type FileUploadPostQueueSchema,
  type FuraffinityUrlUploadPostQueueSchema,
  type UnknownUrlUploadPostQueueSchema,
} from '../database';

const furaffinity = new FuraffinityClient({
  cookieA: env.FURAFFINITY_COOKIE_A,
  cookieB: env.FURAFFINITY_COOKIE_B,
});

export const processPostQueue = async (post: PostQueueSchema) => {
  if ('url' in post) {
    await processFuraffinityPost(post);
  }
}

const processFuraffinityPost = async (post: FuraffinityUrlUploadPostQueueSchema) => {
  const submission = await furaffinity.findSubmission(post.url);
  console.log('submission', submission);
}
