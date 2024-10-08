import crypto from 'node:crypto';

import sharp from 'sharp';
import blockhash from 'blockhash-core';
import fs from 'fs-extra';

import { DB, type PostQueueSchema, type WithId } from '~/server/database';
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
  'image/gif',
];

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

    await fileProcess.avif({ quality: 40 }).toFile(output);

    return {
      path: output,
      mime: 'image/avif',
      ext: 'avif',
    };
  } catch (error) {
    throw new Error('An error occured while optimizing the thumbnail', { cause: error });
  }
}

const hashFile = async (file: FileDownloadResult): Promise<{ hash?: string; checksum?: string }> => {
  // hash images only
  if (!imageMimes.includes(file.mime)) {
    return {};
  }

  try {
    const { data, info } = await sharp(file.path)
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    const hash = blockhash.bmvbhash({
      data,
      width: info.width,
      height: info.height,
     }, HASH_BITS);
    const checksum = crypto.createHash('sha512').update(data).digest('hex');

    return { hash, checksum };
  } catch (error) {
    throw new Error('An error occured while hashing the content file', { cause: error });
  }
}

const getImageMetadata = async (filePath: string): Promise<ImageFileMetadata> => {
  const [{ info }, stats] = await Promise.all([
    sharp(filePath).toBuffer({ resolveWithObject: true }),
    fs.stat(filePath),
  ]);

  return {
    width: info.width,
    height: info.height,
    size: stats.size,
  };
}

const getFileMetadata = async (file: FileDownloadResult): Promise<FileMetadata> => {
  if (!imageMimes.includes(file.mime)) {
    const stats = await fs.stat(file.path);

    return {
      size: stats.size,
    };
  }

  return await getImageMetadata(file.path);
}

export const processFiles = async ({ post, files }: ProcessFilesOptions): Promise<ProcessFilesResult> => {
  await DB.postQueue.addStep(post._id, {
    date: new Date(),
    status: PostQueueStatus.processing,
  });

  const [
    { hash, checksum },
    smallThumbnail,
    fileMetadata,
    thumbnailMetadata,
    attachmentMetadata,
  ] = await Promise.all([
    hashFile(files.content),
    optimizeThumbnail(files.thumbnail.path),
    getFileMetadata(files.content),
    getImageMetadata(files.thumbnail.path),
    files.attachment && fs.stat(files.attachment.path),
  ]);

  const smallThumbnailMetadata = await getImageMetadata(smallThumbnail.path);

  return {
    file: {
      ...fileMetadata,
      hash,
      checksum,
    },
    smallThumbnail: {
      ...smallThumbnailMetadata,
      ...smallThumbnail,
    },
    originalThumbnail: thumbnailMetadata,
    attachment: attachmentMetadata && {
      size: attachmentMetadata.size,
    },
  };
}

export interface ProcessFilesOptions {
  post: WithId<PostQueueSchema>;
  files: DownloadResult;
}

export interface ProcessFilesResult {
  smallThumbnail: FileDownloadResult & ImageFileMetadata;
  originalThumbnail: ImageFileMetadata;
  file: FileMetadata & {
    hash?: string;
    checksum?: string;
  };
  attachment?: {
    size: number;
  };
}

export interface ImageFileMetadata {
  size: number;
  width: number;
  height: number;
}

export interface TextFileMetadata {
  size: number;
}

export type FileMetadata = ImageFileMetadata | TextFileMetadata;
