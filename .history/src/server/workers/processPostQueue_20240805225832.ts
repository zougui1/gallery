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
    await processFuraffinityPostQueue(post);
  }
}
