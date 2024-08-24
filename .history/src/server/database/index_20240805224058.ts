import './connection';

import {
  PostQueueQuery,
  postQueueSchema,
  type PostQueueSchema,
  type FileUploadPostQueueSchema,
  type FuraffinityUrlUploadPostQueueSchema,
  type UnknownUrlUploadPostQueueSchema,
} from './post-queue';
import type { WithId } from './types';

export const DB = {
  postQueue: {
    query: new PostQueueQuery(),
    schema: {
      postQueue: postQueueSchema,
    },
  },
};

export type {
  WithId,
  PostQueueSchema,
  FileUploadPostQueueSchema,
  FuraffinityUrlUploadPostQueueSchema,
  UnknownUrlUploadPostQueueSchema,
};
