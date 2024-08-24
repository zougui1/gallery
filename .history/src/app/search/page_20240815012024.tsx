import { type Metadata } from 'next';
import { Gallery } from 'react-grid-gallery';

import { MainLayout } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';

import { PostThumbnail } from './_components/PostThumbnail';
import { SearchPanel } from './_components/SearchPanel';

export const metadata: Metadata = {
  title: 'Search - Gallery',
};

type SearchProps = {
  searchParams: {
    keywords?: string;
    page?: string;
  };
};

export default async function Search({ searchParams }: SearchProps) {
  const posts = await api.post.find({
    keywords: searchParams.keywords?.split(',').filter(Boolean),
    page: Number(searchParams.page) || 1,
  });

  return (
    <HydrateClient>
      <MainLayout.Body>
        <div className="flex gap-4 flex-wrap">
          {posts.map(post => (
            <PostThumbnail key={post._id} post={post} />
          ))}
        </div>
      </MainLayout.Body>

      <SearchPanel />
    </HydrateClient>
  );
}
