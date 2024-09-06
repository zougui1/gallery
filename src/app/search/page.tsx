import { type Metadata } from 'next';

import { MainLayout, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';
import { PostSelector } from '~/app/_components/organisms/PostSelector';

import { SearchPanel } from './_components/SearchPanel';
import { SearchResult } from './_components/SearchResult';
import { SearchGallery } from './_components/SearchGallery';

export const metadata: Metadata = {
  title: 'Search - Gallery',
};

type SearchProps = {
  searchParams: {
    keywords?: string;
    ratings?: string;
    types?: string;
    page?: string;
  };
};


export default async function Search(props: SearchProps) {
  const searchParams = {
    keywords: props.searchParams.keywords?.split(',').filter(Boolean),
    ratings: props.searchParams.ratings?.split(',').filter(Boolean),
    types: props.searchParams.types?.split(',').filter(Boolean),
    page: Number(props.searchParams.page) || 1,
  };

  const { posts, hasMore } = await api.post.find(searchParams);

  return (
    <HydrateClient>
      <PostSelector.Root>
        <MainLayout.Body className="*:h-full">
          {!posts.length && (
            <Typography.H4>There are no search results for your query.</Typography.H4>
          )}

          {posts.length > 0 && (
            <div className="flex flex-col gap-6 h-full">
              <SearchResult
                hasMore={hasMore}
                searchParams={searchParams}
                className="md:hidden"
              />

              <SearchGallery posts={posts} />
              <SearchResult hasMore={hasMore} searchParams={searchParams} />
            </div>
          )}
        </MainLayout.Body>

        <SearchPanel />
      </PostSelector.Root>
    </HydrateClient>
  );
}
