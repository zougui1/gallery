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
  };
};

export default async function Search(props: SearchProps) {
  const posts = await api.post.find({
    //keywords: props.searchParams.keywords?.
  });
  console.log('props:', props.searchParams)

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
