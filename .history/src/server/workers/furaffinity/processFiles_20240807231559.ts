import sharp from 'sharp';
import blockhash from 'blockhash-core';

import { DB, type FuraffinityUrlUploadPostQueueSchema, type WithId } from '~/server/database';
import { PostQueueStatus } from '~/enums';

import { type FileDownloadResult, type DownloadResult } from './downloadContent';
import { type FileTypeResult } from '../types';

const MAX_HEIGHT = 200;
const HASH_BITS = 12;

const imageMimes: FileTypeResult['mime'][] = [
  'image/jpeg',
  'image/png',
  'image/avif',
  'image/bmp',
  'image/webp',
];

const hashImage = async (filePath: string): Promise<string> => {
  const { data, info } = await sharp(filePath)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  return blockhash.bmvbhash({
    data,
    width: info.width,
    height: info.height,
   }, HASH_BITS);
}

const optimizeThumbnail = async (filePath: string): Promise<FileDownloadResult> => {
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

    return {
      path: output,
      mime: 'image/avif',
      ext: 'avif',
    };
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
    return hashImage(file.path);
  } catch (error) {
    throw new Error('An error occured while hashing the content file', { cause: error });
  }
}

export const processFiles = async ({ post, files }: ProcessFilesOptions): Promise<ProcessFilesResult> => {
  await DB.postQueue.query.addStep(post._id, {
    date: new Date(),
    status: PostQueueStatus.processing,
  });

  const [fileHash, smallThumbnail] = await Promise.all([
    hashFile(files.content),
    optimizeThumbnail(files.thumbnail.path),
  ]);

  return {
    fileHash,
    smallThumbnail,
  };
}

export interface ProcessFilesOptions {
  post: WithId<FuraffinityUrlUploadPostQueueSchema>;
  files: DownloadResult;
}

export interface ProcessFilesResult {
  smallThumbnail: FileDownloadResult;
  fileHash?: string;
}
