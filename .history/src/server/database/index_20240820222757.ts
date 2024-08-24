import './connection';

import {
  PostQuery,
  postSchema,
  type PostSchema,
  type PostSchemaWithId,
} from './post';
import {
  PostQueueQuery,
  postQueueSchema,
  type PostQueueSchema,
  type PostQueueSchemaWithId,
} from './post-queue';
import type { WithId } from './types';

export const DB = {
  post: {
    query: new PostQuery(),
    schema: {
      post: postSchema,
    },
  },

  postQueue: {
    query: new PostQueueQuery(),
    schema: {
      postQueue: postQueueSchema,
    },
  },
};

export type {
  WithId,

  PostSchema,
  PostSchemaWithId,

  PostQueueSchema,
  PostQueueSchemaWithId,
};
