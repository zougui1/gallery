import { FuraffinityClient } from '@zougui/furaffinity';

import { processFuraffinityPostQueue } from './furaffinity';
import {
  type PostQueueSchema,
  type FileUploadPostQueueSchema,
  type FuraffinityUrlUploadPostQueueSchema,
  type UnknownUrlUploadPostQueueSchema,
  type WithId,
} from '../database';

export const processPostQueue = async (post: WithId<PostQueueSchema>) => {
  if ('url' in post) {
    if (FuraffinityClient.URL.checkIsValidHostName(post.url)) {
      return await processFuraffinityPostQueue(post);
    }

    // TODO process unknown URL upload
  }

  // TODO process file upload
}
