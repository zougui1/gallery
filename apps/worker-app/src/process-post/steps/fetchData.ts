import { tryit } from 'radash';

import { type Submission } from '@zougui/furaffinity';
import { PostQueueStatus } from '@zougui/gallery.enums';

import { getUrlSource, UrlSource } from '../getUrlSource';
import { furaffinity } from '../../furaffinity'
import { DB, type PostQueueSchemaWithId } from '../../database';

const fetcherMap = {
  furaffinity: furaffinity.submission.findOne,
  e621: undefined,
  unknown: undefined,
} satisfies Record<UrlSource, ((url: string) => Promise<unknown>) | undefined>;

/**
 * is used to fetch data not as part of the post's processing step
 * @param postQueue
 * @returns
 */
export const rawFetchData = async (url: string): Promise<Submission> => {
  const source = getUrlSource(url);
  const fetcher = fetcherMap[source];

  if (!fetcher) {
    throw new Error(`Cannot download data from this URL: ${url}`);
  }

  const [error, post] = await tryit(fetcher)(url);

  if (error) {
    throw new Error('An error occured while fetching post data', { cause: error });
  }

  if (!post) {
    throw new Error('Post not found');
  }

  return post;
}

export const fetchData = async (postQueue: PostQueueSchemaWithId): Promise<Submission> => {
  await DB.postQueue.findByIdAndUpdate(postQueue._id, {
    $push: {
      steps: {
        date: new Date(),
        status: PostQueueStatus.fetchingData,
      },
    },
  });

  return await rawFetchData(postQueue.url);
}
