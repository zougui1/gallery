import { type Metadata } from 'next';

import { MainLayout, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';
import { PostSelector } from '~/app/_components/organisms/PostSelector';

import { SearchPanel } from './_components/SearchPanel';
import { SearchResult } from './_components/SearchResult';
import { Gallery } from './_components/Gallery';

export const metadata: Metadata = {
  title: 'Search - Gallery',
};

type SearchProps = {
  searchParams: {
    posts?: string;
    ratings?: string;
    types?: string;
    page?: string;
  };
};


export default async function Search(props: SearchProps) {
  const searchParams = {
    postIds: props.searchParams.posts?.split(',').filter(Boolean) ?? [],
  };

  const posts = await api.post.findManyById(searchParams);

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
