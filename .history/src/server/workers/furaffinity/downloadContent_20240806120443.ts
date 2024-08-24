import path from 'node:path';

import { nanoid } from 'nanoid';
import axios from 'axios';

import { type Submission } from '@zougui/furaffinity';

import { DB, type FuraffinityUrlUploadPostQueueSchema, type WithId } from '~/server/database';
import { PostQueueStatus } from '~/enums';

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

  const contentFilePath = path.join('/tmp', contentFileName);
  const thumbnailFilePath = path.join('/tmp', thumbnailFileName);

  const thumbnailResponse = await axios.get(submission.thumbnailUrl, {
    responseType: 'stream',
  });

  //const reader = thumbnailResponse.data.getReader();
  console.log(thumbnailResponse.data)
}
