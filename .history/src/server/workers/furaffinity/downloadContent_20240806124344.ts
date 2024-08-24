import path from 'node:path';
import { Readable, Writable } from 'node:stream';

import { nanoid } from 'nanoid';
import axios from 'axios';
import fs from 'fs-extra';

import { type Submission } from '@zougui/furaffinity';

import { DB, type FuraffinityUrlUploadPostQueueSchema, type WithId } from '~/server/database';
import { PostQueueStatus } from '~/enums';
import { env } from '~/env';

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
  const thumbnailFilePath = path.join(env.CONTENT_DIR, thumbnailFileName);

  const thumbnailResponse = await axios.get(submission.thumbnailUrl, {
    responseType: 'stream',
  });

  if (!(thumbnailResponse.data instanceof Readable)) {
    throw new Error('Cannot read the thumbnail');
  }

  await Promise.allSettled([
    fs.ensureDir(env.TEMP_DIR),
    fs.ensureDir(env.CONTENT_DIR),
  ]);

  const thumbnailWriteStream = fs.createWriteStream(tempThumbnailFilePath);

  thumbnailResponse.data.pipe(thumbnailWriteStream);

  await new Promise((resolve, reject) => {
    thumbnailWriteStream.on('finish', resolve);
    thumbnailWriteStream.on('error', reject);
  });

  await new Promise(r => setTimeout(r, 1000));
  console.log(tempContentFilePath)

  console.log('fileName:', thumbnailFileName);
  console.log('exists:', fs.existsSync(tempContentFilePath));

  await fs.copyFile(tempThumbnailFilePath, thumbnailFilePath);
  //await fs.move(tempThumbnailFilePath, thumbnailFilePath);
}
