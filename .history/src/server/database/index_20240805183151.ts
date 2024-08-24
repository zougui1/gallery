import './connection';

import {
  PostQueueQuery,
  postQueueSchema,
  type PostQueueSchema,
  type FileUploadPostQueueSchema,
  type FuraffinityUrlUploadPostQueueSchema,
  type UnknownUrlUploadPostQueueSchema,
} from './post-queue';

export const DB = {
  postQueue: {
    query: new PostQueueQuery(),
    schema: {
      postQueue: postQueueSchema,
    },
  },
};

export type {
  PostQueueSchema,
  FileUploadPostQueueSchema,
  FuraffinityUrlUploadPostQueueSchema,
  UnknownUrlUploadPostQueueSchema,
};
