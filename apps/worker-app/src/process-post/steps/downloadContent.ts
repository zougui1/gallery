import path from 'node:path';

import fs from 'fs-extra';

import { type Submission } from '@zougui/furaffinity';
import { type PostQueueSchemaWithId } from '@zougui/gallery.database';
import { PostQueueStatus } from '@zougui/gallery.enums';

import { DB } from '../../database';
import { env } from '../../env';
import { downloadFile, type FileDownloadResult, type FileTypeResult } from '../../utils';
import { rawFetchData } from './fetchData';

const downloadAttachment = async (url: string, filePath: string): Promise<FileTypeResult> => {
  const data = await rawFetchData(url);
  return await downloadFile(data.contentUrl, filePath);
}

export const downloadContent = async (
  postQueue: PostQueueSchemaWithId,
  post: Submission,
): Promise<DownloadResult> => {
  const { nanoid } = await import('nanoid');

  const fileName = nanoid();
  const contentFileName = `${fileName}-content`;
  const thumbnailFileName = `${fileName}-thumbnail`;
  const attachmentFileName = `${fileName}-attachment`;

  const tempContentFilePath = path.join(env.TEMP_DIR, contentFileName);
  const tempThumbnailFilePath = path.join(env.TEMP_DIR, thumbnailFileName);
  const tempAttachmentFilePath = path.join(env.TEMP_DIR, attachmentFileName);
  const contentFilePath = path.join(env.CONTENT_DIR, contentFileName);
  const thumbnailFilePath = path.join(env.CONTENT_DIR, thumbnailFileName);
  const attachmentFilePath = path.join(env.CONTENT_DIR, attachmentFileName);

  try {
    await DB.postQueue.findByIdAndUpdate(postQueue._id, {
      $push: {
        steps: {
          date: new Date(),
          status: PostQueueStatus.downloadingContent,
        },
      },
    });

    const [
      contentMimeType,
      thumbnailMimeType,
      attachmentMimeType,
    ] = await Promise.all([
      downloadFile(post.contentUrl, tempContentFilePath),
      downloadFile(post.thumbnailUrl, tempThumbnailFilePath),
      postQueue.attachmentUrl ? downloadAttachment(postQueue.attachmentUrl, tempAttachmentFilePath) : undefined,
    ]);

    await Promise.all([
      fs.move(tempContentFilePath, contentFilePath),
      fs.move(tempThumbnailFilePath, thumbnailFilePath),
      attachmentMimeType && fs.move(tempAttachmentFilePath, attachmentFilePath),
    ]);

    return {
      thumbnail: {
        ...thumbnailMimeType,
        path: thumbnailFilePath,
      },
      content: {
        ...contentMimeType,
        path: contentFilePath,
      },
      attachment: attachmentMimeType ? {
        ...attachmentMimeType,
        path: attachmentFilePath,
      } : undefined,
    };
  } catch (error) {
    throw new Error('An error occured while downloading the post\'s files', { cause: error });
  } finally {
    await Promise.allSettled([
      fs.remove(tempContentFilePath),
      fs.remove(tempThumbnailFilePath),
    ]);
  }
}

export interface DownloadResult {
  content: FileDownloadResult;
  thumbnail?: FileDownloadResult;
  attachment?: FileDownloadResult;
}
