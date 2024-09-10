'use client';

import { group, sort } from 'radash';
import { ChevronDown, Plus } from 'lucide-react';

import { Button, IconButton, Typography } from '@zougui/react.ui';

import { api } from '~/trpc/react';
import { type PostQueueSchemaWithId, type PostSchemaWithId } from '~/server/database';

import { ChapterSection } from './ChapterSection';
import { type ChapterSectionNewPageButtonProps } from './ChapterSection/ChapterSectionNewPageButton';
import { PostQueueStatus, PostSeriesType } from '~/enums';
import { nanoid } from 'nanoid';
import { Status } from '~/app/dashboard/posts/_components/Status';
import { PostQueueDropdown } from '~/app/dashboard/posts/_components/PostQueueDropdown';

type Chapter = {
  name?: string;
  index: number;
  queues: PostQueueSchemaWithId[];
}

const getPostMap = (posts: PostSchemaWithId[]): Map<number, Map<number, PostSchemaWithId>> => {
  const map = new Map<number, Map<number, PostSchemaWithId>>();

  const getByChapter = (chapterIndex: number): Map<number, PostSchemaWithId> => {
    const pageMap = map.get(chapterIndex);

    if (pageMap) {
      return pageMap;
    }

    const newPageMap = new Map<number, PostSchemaWithId>();
    map.set(chapterIndex, newPageMap);

    return newPageMap;
  }

  for (const post of posts) {
    if (!post.series) {
      continue;
    }

    const pageMap = getByChapter(post.series.chapterIndex);
    pageMap.set(post.series.partIndex, post);
  }

  return map;
}

export const Comic = ({ seriesId }: ComicProps) => {
  const [posts] = api.post.findBySeriesId.useSuspenseQuery({ id: seriesId });
  const [postQueues] = api.postQueue.findBySeriesId.useSuspenseQuery({ id: seriesId });

  const chapters: Chapter[] = [];
  const postByChapter = group(postQueues, p => p.series?.chapterIndex ?? 0);

  const postMap = getPostMap(posts);

  for (const posts of Object.values(postByChapter)) {
    const [post] = posts ?? [];

    if (!posts || !post?.series) {
      continue;
    }

    chapters.push({
      index: post.series.chapterIndex,
      name: post.series.chapterName,
      queues: posts,
    });
  }

  const series = posts.find(p => p.series)?.series;

  const utils = api.useUtils();
  const creationMutation = api.postQueue.create.useMutation({
    onSuccess: async () => {
      await utils.postQueue.invalidate();
      await utils.post.invalidate();
    },
  });

  const createPage = (chapter: Chapter): ChapterSectionNewPageButtonProps['onNewPage'] => {
    return (data) => {
      const altId = nanoid();
      const now = Date.now();

      creationMutation.mutate([data, ...data.alts].map((submission, index) => {
        return {
          ...submission,
          series: {
            partIndex: data.series.partIndex,
            id: posts[0]?.series?.id ?? '',
            type: PostSeriesType.comic,
            chapterIndex: chapter.index,
            chapterName: chapter.name,
            name: posts[0]?.series?.name ?? 'Untitled',
          },
          alt: data.alts.length ? {
            id: altId,
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            label: ('alt' in submission && submission.alt?.label) || 'Original',
          } : undefined,
          createdAt: new Date(now + index),
        };
      }));
    }
  }

  return (
    <div className="w-full flex flex-col gap-6 flex-wrap">
      {series && (
        <Typography.H1 className="w-full text-center">
          <span className="capitalize">{series.type}</span>
          {` - ${series.name}`}
        </Typography.H1>
      )}

      {sort(chapters, c => c.index).map(chapter => (
        <ChapterSection.Root
          key={chapter.index}
          seriesId={seriesId}
          index={chapter.index}
          title={chapter.name}
          pages={chapter.queues}
        >
          <ChapterSection.Title />

          <ChapterSection.List>
            {sort(chapter.queues, q => q.series?.partIndex ?? 0).map(queue => {
              const post = postMap.get(chapter.index)?.get(queue.series?.partIndex ?? 0);

              if (post) {
                return <ChapterSection.Item key={queue._id} post={post} />;
              }

              const status = queue.steps[queue.steps.length - 1]?.status ?? PostQueueStatus.idle;

              return (
                <div key={queue._id} className="flex flex-col w-28">
                  <div className="w-full h-48 flex-1 flex justify-center items-center">
                    <Status status={status} />
                  </div>

                  <div className="flex">
                    <Typography.Paragraph className="w-full text-sm font-semibold text-center break-words">
                      Page {queue.series?.partIndex}
                      {queue.alt && ` - ${queue.alt.label}`}
                    </Typography.Paragraph>

                    <PostQueueDropdown post={queue}>
                      <IconButton className="p-0">
                        <ChevronDown />
                      </IconButton>
                    </PostQueueDropdown>
                  </div>
                </div>
              );
            })}

            <ChapterSection.NewPageButton
              onNewPage={createPage(chapter)}
            />
          </ChapterSection.List>
        </ChapterSection.Root>
      ))}

      <section className="w-full flex justify-center">
        <Typography.H5 className="flex items-center">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add chapter
          </Button>
        </Typography.H5>
      </section>
    </div>
  );
}

export interface ComicProps {
  seriesId: string;
}
