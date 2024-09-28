'use client';

import { group, sort } from 'radash';
import { ChevronDown, Plus } from 'lucide-react';

import { Button, IconButton, Typography } from '@zougui/react.ui';

import { api } from '~/trpc/react';
import { type PostQueueSchemaWithId } from '~/server/database';

import { ChapterSection } from './ChapterSection';
import { type ChapterSectionNewPageButtonProps } from './ChapterSection/ChapterSectionNewPageButton';
import { PostQueueStatus, PostSeriesType } from '~/enums';
import { nanoid } from 'nanoid';
import { Status } from '~/app/dashboard/posts/_components/Status';
import { PostQueueDropdown } from '~/app/dashboard/posts/_components/PostQueueDropdown';
import { ChapterFormDialog, type ChapterFormDialogProps } from '~/app/upload/_components/comic-form/ChapterFormDialog';
import { multiSort } from '~/utils';

type Chapter = {
  name?: string;
  index: number;
  queues: PostQueueSchemaWithId[];
}

export const Comic = ({ seriesId }: ComicProps) => {
  const [posts] = api.post.findBySeriesId.useSuspenseQuery({ id: seriesId });
  const [postQueues] = api.postQueue.findBySeriesId.useSuspenseQuery({ id: seriesId });

  const seriesName = posts[0]?.series?.name ?? 'Untitled';
  const chapters: Chapter[] = [];
  const postByChapter = group(postQueues, p => p.series?.chapterIndex ?? 0);

  const postMap = new Map(posts.map(post => [post.sourceUrl, post]));

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

      creationMutation.mutate({
        newPosts: [data, ...data.alts].map((submission, index) => {
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
        }),
      });
    }
  }

  const createChapter: ChapterFormDialogProps['onSubmit'] = (chapter) => {
    const now = Date.now();

    const pages = chapter.pages.flatMap(chapterPage => {
      const altId = nanoid();

      return [chapterPage, ...chapterPage.alts].map((submission, index) => {
        return {
          ...submission,
          createdAt: new Date(now + (chapter.chapterIndex * 1000) + (chapterPage.series.partIndex * 10) + index),
          series: {
            ...chapterPage.series,
            type: PostSeriesType.comic,
            name: seriesName,
            chapterName: chapter.title,
            chapterIndex: chapter.chapterIndex,
            id: seriesId,
          },
          alt: chapterPage.alts.length ? {
            id: altId,
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            label: ('alt' in submission && submission.alt?.label) || 'Original',
          } : undefined,
        };
      });
    });

    creationMutation.mutate({ newPosts: pages });
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
            {multiSort(chapter.queues, [{ fn: q => q.series?.partIndex ?? 0 }, { fn: q => q.createdAt }]).flatMap(queue => {
              /*const postOrAltsMap = postMap.get(chapter.index)?.get(queue.series?.partIndex ?? 0);
              const post = postOrAltsMap instanceof Map && queue.alt
                ? postOrAltsMap.get(queue.alt.label)
                : postOrAltsMap;*/

              const post = postMap.get(queue.url);

              if (post && !(post instanceof Map)) {
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
        <ChapterFormDialog
          defaultValues={{
            _id: seriesId,
            chapterIndex: chapters.length + 1,
          }}
          onSubmit={createChapter}
        >
          <ChapterFormDialog.Trigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add chapter
            </Button>
          </ChapterFormDialog.Trigger>
        </ChapterFormDialog>
      </section>
    </div>
  );
}

export interface ComicProps {
  seriesId: string;
}
