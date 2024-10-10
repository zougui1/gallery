import sharp from 'sharp';
import fs from 'fs-extra';

import { imageMimes } from './data';
import { type FileDownloadResult } from './types';

export const getImageMetadata = async (filePath: string): Promise<ImageFileMetadata> => {
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

export const getFileMetadata = async (file: FileDownloadResult): Promise<FileMetadata> => {
  if (!imageMimes.includes(file.mime)) {
    const stats = await fs.stat(file.path);

    return {
      size: stats.size,
    };
  }

  return await getImageMetadata(file.path);
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
