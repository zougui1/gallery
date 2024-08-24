import sharp from 'sharp';

import { type Submission } from '@zougui/furaffinity';

import { DB, type FuraffinityUrlUploadPostQueueSchema, type WithId } from '~/server/database';
import { PostQueueStatus } from '~/enums';

import { type DownloadResult } from './downloadContent';

const optimizeThumbnail = async (filePath: string): Promise<string> => {
  const output = `${filePath}.avif`;

  await sharp(filePath)
    .avif()
    .toFile(output);

  return output;
}

export const processFiles = async ({ post, submission, files }: ProcessFilesOptions) => {
  await DB.postQueue.query.addStep(post._id, {
    date: new Date(),
    status: PostQueueStatus.processing,
  });

  await optimizeThumbnail(files.thumbnail.path);
}

export interface ProcessFilesOptions {
  post: WithId<FuraffinityUrlUploadPostQueueSchema>,
  submission: Submission
  files: DownloadResult;
}
