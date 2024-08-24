import sharp from 'sharp';

import { type Submission } from '@zougui/furaffinity';

import { DB, type FuraffinityUrlUploadPostQueueSchema, type WithId } from '~/server/database';
import { PostQueueStatus } from '~/enums';

import { type DownloadResult } from './downloadContent';

const MAX_HEIGHT = 200;

const optimizeThumbnail = async (filePath: string): Promise<string> => {
  const output = `${filePath}.avif`;

  let fileProcess = sharp(filePath);

  const metadata = await sharp(filePath).metadata();

  if (metadata.height && metadata.height > MAX_HEIGHT) {
    fileProcess = fileProcess.resize({ height: MAX_HEIGHT });
  }



  await fileProcess.jpeg({ quality: 60 }).toFile(`${output}.jpg`);

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
