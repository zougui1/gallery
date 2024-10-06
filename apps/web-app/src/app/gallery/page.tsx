import { type Metadata } from 'next';

import { MainLayout, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';

import { Gallery } from './_components/Gallery';

export const metadata: Metadata = {
  title: 'Gallery',
};

type SearchProps = {
  searchParams: {
    posts?: string;
    alts?: string;
    series?: string;
  };
};


export default async function Search(props: SearchProps) {
  const searchParams = {
    postIds: props.searchParams.posts?.split(',').filter(Boolean) ?? [],
    altIds: props.searchParams.alts?.split(',').filter(Boolean) ?? [],
    seriesIds: props.searchParams.series?.split(',').filter(Boolean) ?? [],
  };

  const posts = await api.post.getGallery(searchParams);

  return (
    <HydrateClient>
      <MainLayout.Body className="*:h-full">
        {!posts.length && (
          <Typography.H4>There are no posts.</Typography.H4>
        )}

        {posts.length > 0 && (
          <div className="flex flex-col gap-6 h-full">
            <Gallery posts={posts} />
          </div>
        )}
      </MainLayout.Body>
    </HydrateClient>
  );
}
