import path from 'node:path';

import { tryit } from 'radash';

import type { Submission } from '@zougui/furaffinity';

import {
  DB,
  type FuraffinityUrlUploadPostQueueSchema,
  type WithId,
} from '~/server/database';
import { PostQueueStatus, PostType } from '~/enums';
import { getErrorMessage } from '~/utils';

import { fetchData } from './fetchData';
import { downloadContent } from './downloadContent';
import { processFiles } from './processFiles';

type TryStepResult<T> = (
  | [error: undefined, result: T]
  | [error: Error, result: undefined]
);

const mapType: Record<Submission['type'], PostType> = {
  image: PostType.art,
  story: PostType.story,
  music: PostType.music,
  flash: PostType.flash,
  unknown: PostType.unknown,
};

const tryStep = <Args extends unknown[], Return>(
  func: (...args: Args) => Promise<Return>,
  post: WithId<FuraffinityUrlUploadPostQueueSchema>,
  defaultErrorMessage: string
) => {
  return async (...args: Args): Promise<TryStepResult<Return>> => {
    const res = await tryit(func)(...args);
    const [error] = res;

    if (error) {
      await DB.postQueue.query.addStep(post._id, {
        date: new Date(),
        status: PostQueueStatus.error,
        message: getErrorMessage(error, defaultErrorMessage),
      });
    }

    return res;
  }
}

export const processFuraffinityPostQueue = async (post: WithId<FuraffinityUrlUploadPostQueueSchema>) => {
  const [fetchError, submission] = await tryStep(fetchData, post, 'An error occured while fetching submission data')(post);

  if (fetchError) {
    console.error(fetchError);
    return;
  }

  if (!submission) {
    await DB.postQueue.query.addStep(post._id, {
      date: new Date(),
      status: PostQueueStatus.error,
      message: 'Submission not found',
    });

    return;
  }

  const [downloadError, files] = await tryStep(downloadContent, post, 'An error occured while downloading the submission files')(post, submission);

  if (downloadError) {
    console.error(downloadError);
    return;
  }

  const [processError, result] = await tryStep(processFiles, post, 'An error occured while processing the submission')({
    post,
    files,
  });

  if (processError) {
    console.error(processError);
    return;
  }

  await DB.post.query.create({
    sourceUrl: submission.url,
    title: submission.title,
    contentType: mapType[submission.type],
    description: submission.descriptionText,
    keywords: submission.keywords,
    author: submission.author,
    file: {
      fileName: path.basename(files.content.path),
      contentType: files.content.mime,
      hash: result.fileHash,
    },

    thumbnail: {
      original: {
        fileName: path.basename(files.thumbnail.path),
        contentType: files.thumbnail.mime,
      },

      small: {
        fileName: path.basename(result.smallThumbnail.path),
        contentType: result.smallThumbnail.mime,
      },
    },

    postedAt: submission.postedAt,
    createdAt: new Date(),

    originalData: submission,
  });

  // TODO if success then add the post to the collection 'posts'
  //* scanning:
  //*   - exact match on the file hash
  //*   - cursor through the collection (order by _id in ASC order) for a distance match (distance threshold: 6)
  //* if either of those match, match against the images' pixels to automatically delete guaranteed duplicates

  //console.log('submission', submission);
}
