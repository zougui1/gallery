import { type Metadata } from 'next';

import { MainLayout } from '@zougui/react.ui';

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
    page?: string;
  };
};


export default async function Search(props: SearchProps) {
  const searchParams = {
    keywords: props.searchParams.keywords?.split(',').filter(Boolean),
    page: Number(props.searchParams.page) || 1,
  };

  const { posts, hasMore } = await api.post.find(searchParams);

  return (
    <HydrateClient>
      <MainLayout.Body>
        <div className="flex flex-col gap-6">
          <SearchResult hasMore={hasMore} searchParams={searchParams} />

          <div className="flex justify-center gap-4 flex-wrap">
            {posts.map(post => (
              <PostThumbnail key={post._id} post={post} />
            ))}
          </div>

          <SearchResult hasMore={hasMore} searchParams={searchParams} />
        </div>
      </MainLayout.Body>

      <SearchPanel />
    </HydrateClient>
  );
}
