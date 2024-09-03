import './connection';

import {
  PostQuery,
  type PostSchema,
  type PostSchemaWithId,
} from './post';
import {
  PostQueueQuery,
  type PostQueueSchema,
  type PostQueueSchemaWithId,
} from './post-queue';
import type { WithId } from './types';

export const DB = {
  post: new PostQuery(),
  postQueue: new PostQueueQuery(),
};

export type {
  WithId,

  PostSchema,
  PostSchemaWithId,

  PostQueueSchema,
  PostQueueSchemaWithId,
};
