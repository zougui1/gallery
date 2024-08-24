import './connection';

import { PostQueueQuery, postQueueSchema } from './post-queue';

export const DB = {
  postQueue: {
    query: new PostQueueQuery(),
    schema: {
      postQueue: postQueueSchema,
    },
  },
};
