import path from 'node:path';
import stream, { Readable, Transform } from 'node:stream';

import { nanoid } from 'nanoid';
import axios from 'axios';
import fs from 'fs-extra';
import { fileTypeStream, type FileTypeResult } from 'file-type';

import { type Submission } from '@zougui/furaffinity';

import { DB, type FuraffinityUrlUploadPostQueueSchema, type WithId } from '~/server/database';
import { PostQueueStatus } from '~/enums';
import { env } from '~/env';

const downloadFile = async (url: string, filePath: string): Promise<void> => {
  const response = await axios.get(url, {
    responseType: 'stream',
  });

  // this should not happen, just for type safety
  if (!(response.data instanceof Readable)) {
    throw new Error('Cannot read the file');
  }

  const writeStream = fs.createWriteStream(filePath);

  // fileTypeStream also works with node's Readable stream but doesn't
  // account for it in its types
  const downloadStream = response.data as unknown as ReadableStream;
  const fileStream = await fileTypeStream(downloadStream);

  // this should not happen, just for type safety
  if (!(fileStream instanceof Transform)) {
    throw new Error('Cannot read the file');
  }

  fileStream.pipe(writeStream);

  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  return fileStream.fileType;
}

export const downloadContent = async (
  post: WithId<FuraffinityUrlUploadPostQueueSchema>,
  submission: Submission
) => {
  await DB.postQueue.query.addStep(post._id, {
    date: new Date(),
    status: PostQueueStatus.downloadingContent,
  });

  const fileName = nanoid();
  const contentFileName = `content-${fileName}`;
  const thumbnailFileName = `thumbnail-${fileName}`;

  const tempContentFilePath = path.join(env.TEMP_DIR, contentFileName);
  const tempThumbnailFilePath = path.join(env.TEMP_DIR, thumbnailFileName);
  const contentFilePath = path.join(env.CONTENT_DIR, contentFileName);
  const thumbnailFilePath = path.join(env.CONTENT_DIR, thumbnailFileName);

  await Promise.allSettled([
    fs.ensureDir(env.TEMP_DIR),
    fs.ensureDir(env.CONTENT_DIR),
  ]);

  try {
    await Promise.all([
      downloadFile(submission.contentUrl, tempContentFilePath),
      downloadFile(submission.thumbnailUrl, tempThumbnailFilePath),
    ]);

    await Promise.all([
      fs.move(tempContentFilePath, contentFilePath),
      fs.move(tempThumbnailFilePath, thumbnailFilePath),
    ]);
  } catch (error) {
    await Promise.allSettled([
      fs.remove(tempContentFilePath),
      fs.remove(tempThumbnailFilePath),
    ]);

    throw error;
  }
}
