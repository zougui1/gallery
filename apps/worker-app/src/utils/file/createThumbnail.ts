import sharp from 'sharp';

import { type FileDownloadResult, type ThumbnailImageFormat } from './types';

const formatToExtMap: Record<ThumbnailImageFormat, FileDownloadResult['ext']> = {
  avif: 'avif',
  jpeg: 'jpg',
  png: 'png',
  webp: 'webp',
};

export const createThumbnail = async (filePath: string, options: CreateThumbnailOptions): Promise<FileDownloadResult> => {
  const { format, maxHeight, quality } = options;
  const extension = formatToExtMap[format];
  const output = `${filePath}.${extension}`;

  let fileProcess = sharp(filePath);

  if (maxHeight) {
    const metadata = await sharp(filePath).metadata();

    // resize the optimized thumbnail only if the original
    // image is bigger than the optimized max height
    if (metadata.height && metadata.height > maxHeight) {
      fileProcess = fileProcess.resize({ height: maxHeight });
    }
  }

  await fileProcess.toFormat(format, { quality, progressive: true }).toFile(output);

  return {
    path: output,
    mime: `image/${format}`,
    ext: extension,
  };
}

export interface CreateThumbnailOptions {
  format: ThumbnailImageFormat;
  maxHeight?: number;
  quality?: number;
}
