import path from 'node:path';
import { Readable } from 'node:stream';

import { nanoid } from 'nanoid';
import axios from 'axios';
import fs from 'fs-extra';
import { fileTypeFromFile } from 'file-type';

import { type Submission } from '@zougui/furaffinity';

import { DB, type PostQueueSchema, type WithId } from '~/server/database';
import { PostQueueStatus } from '~/enums';
import { env } from '~/env';

import { client } from './client';
import { type FileTypeResult } from '../types';

const isSubmissionUrl = (url: string): boolean => {
  try {
    client.submission.extractSubmissionId(url);
    return true;
  } catch {
    return false
  }
}

const downloadAttachment = async (url: string, filePath: string): Promise<FileTypeResult> => {
  if (!isSubmissionUrl(url)) {
    return await downloadFile(url, filePath);
  }

  const submission = await client.submission.findOne(url);
  return await downloadFile(submission.contentUrl, filePath);
}

const downloadFile = async (url: string, filePath: string): Promise<FileTypeResult> => {
  const response = await axios.get(url, {
    responseType: 'stream',
  });

  // this should not happen, just for type safety
  if (!(response.data instanceof Readable)) {
    throw new Error('Cannot read the file');
  }

  const writeStream = fs.createWriteStream(filePath);

  response.data.pipe(writeStream);

  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  const fileType = await fileTypeFromFile(filePath);

  if (!fileType) {
    if (url.endsWith('.txt')) {
      return {
        ext: 'txt',
        mime: 'text/plain',
      };
    }

    throw new Error(`Unknown file type: ${url}`);
  }

  return fileType;
}

export const downloadContent = async (
  post: WithId<PostQueueSchema>,
  submission: Submission
): Promise<DownloadResult> => {
  await DB.postQueue.addStep(post._id, {
    date: new Date(),
    status: PostQueueStatus.downloadingContent,
  });

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

  await Promise.allSettled([
    fs.ensureDir(env.TEMP_DIR),
    fs.ensureDir(env.CONTENT_DIR),
  ]);

  try {
    const [
      contentMimeType,
      thumbnailMimeType,
      attachmentMimeType,
    ] = await Promise.all([
      downloadFile(submission.contentUrl, tempContentFilePath),
      downloadFile(submission.thumbnailUrl, tempThumbnailFilePath),
      post.attachmentUrl ? downloadAttachment(post.attachmentUrl, tempAttachmentFilePath) : undefined,
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
    await Promise.allSettled([
      fs.remove(tempContentFilePath),
      fs.remove(tempThumbnailFilePath),
    ]);

    throw error;
  }
}

export interface FileDownloadResult extends FileTypeResult {
  path: string;
}

export interface DownloadResult {
  thumbnail: FileDownloadResult;
  content: FileDownloadResult;
  attachment?: FileDownloadResult;
}
