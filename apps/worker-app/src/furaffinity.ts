import { FurAffinityClient } from '@zougui/furaffinity';

import { env } from './env';

export const furaffinity = new FurAffinityClient({
  cookieA: env.FURAFFINITY_COOKIE_A,
  cookieB: env.FURAFFINITY_COOKIE_B,
});
