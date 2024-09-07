import { type Metadata } from 'next';
import { Plus } from 'lucide-react';

import { Button, IconButton, MainLayout, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';
import { type PostSchemaWithId } from '~/server/database';
import { group, sort } from 'radash';
import { PostThumbnail } from '~/app/_components/organisms/PostThumbnail';
import { PageDropdown } from './_components/PageDropdown';


type SeriesProps = {
  params: {
    id: string;
  };
};

type Chapter = {
  name?: string;
  index: number;
  pages: PostSchemaWithId[];
}

export const generateMetadata = async ({ params }: SeriesProps): Promise<Metadata> => {
  const [post] = await api.post.findBySeriesId({ id: params.id });

  const titlePrefix = post?.series ? post.series.name : 'Series not found';

  return {
    title: `${titlePrefix} - Gallery`,
    description: 'Gallery',
  };
}

export default async function Series({ params }: SeriesProps) {
  const posts = await api.post.findBySeriesId({ id: params.id });

  const chapters: Chapter[] = [];
  const postByChapter = group(posts, p => p.series?.chapterIndex ?? 0);

  for (const posts of Object.values(postByChapter)) {
    const [post] = posts ?? [];

    if (!posts || !post?.series) {
      continue;
    }

    chapters.push({
      index: post.series.chapterIndex,
      name: post.series.chapterName,
      pages: posts,
    });
  }

  const series = posts.find(p => p.series)?.series;

  return (
    <HydrateClient>
      <MainLayout.Body className="w-full">
        {!chapters.length && (
          <Typography.H1>This series does not exist.</Typography.H1>
        )}

        {chapters.length > 0 && (
          <div className="w-full flex flex-col gap-6 flex-wrap">
            {series && (
              <Typography.H1 className="w-full text-center">
                <span className="capitalize">{series.type}</span>
                {` - ${series.name}`}
              </Typography.H1>
            )}

            {sort(chapters, c => c.index).map(chapter => (
              <section key={chapter.index} className="w-full">
                <Typography.H5 className="w-full text-center mb-4">
                  Chapter {chapter.index}
                  {chapter.name && ` - ${chapter.name}`}
                </Typography.H5>

                <div className="w-full flex gap-4 flex-wrap">
                  {sort(chapter.pages, p => p.series?.partIndex ?? 0).map(post => (
                    <PostThumbnail.Root key={post._id} post={post}>
                      <PostThumbnail.Image />

                      <div className="flex">
                        <PostThumbnail.Title>
                          Page {post.series?.partIndex}
                          {post.alt && ` - ${post.alt.label}`}
                        </PostThumbnail.Title>
                        <PageDropdown />
                      </div>
                    </PostThumbnail.Root>
                  ))}

                  <div className="h-48 w-16 flex justify-center items-center">
                    <IconButton>
                      <span>
                        <Plus />
                        <span className="sr-only text-xs text-center">Add page</span>
                      </span>
                    </IconButton>
                  </div>
                </div>
              </section>
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
        )}
      </MainLayout.Body>
    </HydrateClient>
  );
}
