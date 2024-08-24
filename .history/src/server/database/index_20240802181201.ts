import './connection';

import { PostQueueQuery } from './post-queue';

export const DB = {
  postQueue: new PostQueueQuery(),
};
