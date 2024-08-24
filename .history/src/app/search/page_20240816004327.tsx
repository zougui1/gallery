import { type Metadata } from 'next';

import { MainLayout, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';

import { PostThumbnail } from './_components/PostThumbnail';
import { SearchPanel } from './_components/SearchPanel';
import { SearchResult } from './_components/SearchResult';

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
      <MainLayout.Body className="*:h-full">
        {!posts.length && (
          <Typography.H4>There are no search results for your query.</Typography.H4>
        )}

        {posts.length > 0 && (
          <div className="flex flex-col gap-6 h-full">
            <div className="relative flex justify-center gap-4 flex-wrap md:max-h-[calc(100vh-180px)] overflow-y-auto shadow-inner shadow-black/30">
              <div className="w-full sticky top-0 z-50 h-1.5 shadow-inner shadow-black" />

              {posts.map(post => (
                <PostThumbnail key={post._id} post={post} />
              ))}
            </div>

            <SearchResult hasMore={hasMore} searchParams={searchParams} />
          </div>
        )}
      </MainLayout.Body>

      <SearchPanel />
    </HydrateClient>
  );
}
