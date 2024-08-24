import sharp from 'sharp';
import imgHash from 'imghash';

import { type Submission } from '@zougui/furaffinity';

import { DB, type FuraffinityUrlUploadPostQueueSchema, type WithId } from '~/server/database';
import { PostQueueStatus } from '~/enums';

import { type FileDownloadResult, type DownloadResult } from './downloadContent';
import { type FileTypeResult } from '../types';

const MAX_HEIGHT = 200;
const HASH_LENGTH = 64;

const imageMimes: FileTypeResult['mime'][] = [
  'image/jpeg',
  'image/png',
  'image/avif',
  'image/bmp',
  'image/webp',
];

const optimizeThumbnail = async (filePath: string): Promise<string> => {
  const output = `${filePath}.avif`;


  try {
    const metadata = await sharp(filePath).metadata();
    let fileProcess = sharp(filePath);

    // resize the optimized thumbnail only if the original
    // image is bigger than the optimized max height
    if (metadata.height && metadata.height > MAX_HEIGHT) {
      fileProcess = fileProcess.resize({ height: MAX_HEIGHT });
    }

    await fileProcess.avif({ quality: 60 }).toFile(output);

    return output;
  } catch (error) {
    throw new Error('An error occured while optimizing the thumbnail', { cause: error });
  }
}

const hashFile = async (file: FileDownloadResult): Promise<string | undefined> => {
  // hash images only
  if (!imageMimes.includes(file.mime)) {
    return;
  }

  try {
    return await imgHash.hash(file.path, Math.round(HASH_LENGTH / 4));
  } catch (error) {
    throw new Error('An error occured while hashing the content file', { cause: error });
  }
}

export const processFiles = async ({ post, files }: ProcessFilesOptions): Promise<ProcessFilesResult> => {
  await DB.postQueue.query.addStep(post._id, {
    date: new Date(),
    status: PostQueueStatus.processing,
  });

  const [hash] = await Promise.all([
    hashFile(files.content),
    optimizeThumbnail(files.thumbnail.path),
  ]);

  return {
    hash,
  };
}

export interface ProcessFilesOptions {
  post: WithId<FuraffinityUrlUploadPostQueueSchema>;
  files: DownloadResult;
}

export interface ProcessFilesResult {
  hash?: string;
}
