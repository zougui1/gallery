import fs from 'fs-extra';

import { PostQueueStatus } from '@zougui/gallery.enums';

import { DownloadResult } from './downloadContent';
import {
  getFileMetadata,
  getImageMetadata,
  hashFile,
  createThumbnail,
  type FileDownloadResult,
  type FileMetadata,
  type HashFileResult,
  type ImageFileMetadata
} from '../../utils';
import { DB, type PostQueueSchemaWithId } from '../../database';

const MAX_THUMBNAIL_HEIGHT = 200;
const NORMAL_THUMBNAIL_QUALITY = 40;
const SMALL_THUMBNAIL_QUALITY = 40;

const ensureThumbnail = async (files: DownloadResult): Promise<FileDownloadResult | undefined> => {
  if (files.thumbnail) {
    return files.thumbnail;
  }

  if (files.content.mime.split('/')[0] !== 'image') {
    return;
  }

  return await createThumbnail(files.content.path, {
    format: 'jpeg',
    quality: NORMAL_THUMBNAIL_QUALITY,
    maxHeight: MAX_THUMBNAIL_HEIGHT,
  });
}

export const processFiles = async (postQueue: PostQueueSchemaWithId, files: DownloadResult): Promise<ProcessFilesResult> => {
  try {
    await DB.postQueue.findByIdAndUpdate(postQueue._id, {
      $push: {
        steps: {
          date: new Date(),
          status: PostQueueStatus.processing,
        },
      },
    });

    const thumbnail = await ensureThumbnail(files);

    const [
      { differencialHash, uniqueHash },
      smallThumbnail,
      fileMetadata,
      thumbnailMetadata,
      attachmentMetadata,
    ] = await Promise.all([
      hashFile(files.content),
      thumbnail && createThumbnail(thumbnail.path, {
        format: 'avif',
        maxHeight: MAX_THUMBNAIL_HEIGHT,
        quality: SMALL_THUMBNAIL_QUALITY,
      }),
      getFileMetadata(files.content),
      thumbnail && getImageMetadata(thumbnail.path),
      files.attachment && fs.stat(files.attachment.path),
    ]);

    const smallThumbnailMetadata = smallThumbnail && await getImageMetadata(smallThumbnail.path);

    return {
      file: {
        ...fileMetadata,
        differencialHash,
        uniqueHash,
      },
      smallThumbnail: smallThumbnailMetadata && smallThumbnail && {
        ...smallThumbnailMetadata,
        ...smallThumbnail,
      },
      originalThumbnail: thumbnailMetadata,
      attachment: attachmentMetadata && {
        size: attachmentMetadata.size,
      },
    };
  } catch (error) {
    throw new Error('An error occured while processing the post', { cause: error });
  }
}

export interface ProcessFilesResult {
  smallThumbnail?: FileDownloadResult & ImageFileMetadata;
  originalThumbnail?: ImageFileMetadata;
  file: FileMetadata & HashFileResult;
  attachment?: {
    size: number;
  };
}
