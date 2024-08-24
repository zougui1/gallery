import './connection';

import {
  PostQueueQuery,
  postQueueSchema,
  type PostQueueSchema,
} from './post-queue';

export const DB = {
  postQueue: {
    query: new PostQueueQuery(),
    schema: {
      postQueue: postQueueSchema,
    },
  },
};

export type { PostQueueSchema };
