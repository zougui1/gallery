import path from 'node:path';
import stream, { Readable, Transform } from 'node:stream';

import { nanoid } from 'nanoid';
import axios from 'axios';
import fs from 'fs-extra';
import { fileTypeFromBuffer, fileTypeFromStream, fileTypeStream, type FileTypeResult } from 'file-type';

import { type Submission } from '@zougui/furaffinity';

import { DB, type FuraffinityUrlUploadPostQueueSchema, type WithId } from '~/server/database';
import { PostQueueStatus } from '~/enums';
import { env } from '~/env';

const downloadFile = async (url: string, filePath: string): Promise<void> => {
  const thumbnailResponse = await axios.get(url, {
    responseType: 'stream',
  });

  if (!(thumbnailResponse.data instanceof Readable)) {
    throw new Error('Cannot read the thumbnail');
  }

  const thumbnailWriteStream = fs.createWriteStream(filePath);

  const fileType = await fileTypeFromStream(thumbnailResponse.data as any);
  thumbnailResponse.data.pipe(thumbnailWriteStream);

  await new Promise((resolve, reject) => {
    thumbnailWriteStream.on('finish', resolve);
    thumbnailWriteStream.on('error', reject);
  });

  console.log('fileType:', fileType)
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
