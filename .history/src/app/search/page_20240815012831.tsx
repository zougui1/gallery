import { type Metadata } from 'next';
import { Gallery } from 'react-grid-gallery';

import { Button, MainLayout, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';

import { PostThumbnail } from './_components/PostThumbnail';
import { SearchPanel } from './_components/SearchPanel';
import { AppLink } from '../_components/atoms/AppLink';

export const metadata: Metadata = {
  title: 'Search - Gallery',
};

type SearchProps = {
  searchParams: {
    keywords?: string;
    page?: string;
  };
};

export const SearchResult = ({ page, keywords }: SearchResultProps) => {
  const prevParams = new URLSearchParams({
    page: String(page - 1),
  });
  const nextParams = new URLSearchParams({
    page: String(page + 1),
  });

  if(keywords) {
    prevParams.set('keywords', keywords.join(','));
    nextParams.set('keywords', keywords.join(','));
  }

  return (
    <div className="flex justify-center gap-4">
      <Button asChild>
        <AppLink.Internal href={`/search?${prevParams.toString()}`}>Previous</AppLink.Internal>
        <Typography.Span>Search result page #{page}</Typography.Span>
        <AppLink.Internal href={`/search?${nextParams.toString()}`}>Next</AppLink.Internal>
      </Button>
    </div>
  );
}

export interface SearchResultProps {
  page: number;
  keywords?: string[];
}

export default async function Search(props: SearchProps) {
  const searchParams = {
    keywords: props.searchParams.keywords?.split(',').filter(Boolean),
    page: Number(props.searchParams.page) || 1,
  };

  const posts = await api.post.find(searchParams);

  return (
    <HydrateClient>
      <MainLayout.Body>
        <SearchResult {...searchParams} />

        <div className="flex gap-4 flex-wrap">
          {posts.map(post => (
            <PostThumbnail key={post._id} post={post} />
          ))}
        </div>

        <SearchResult {...searchParams} />
      </MainLayout.Body>

      <SearchPanel />
    </HydrateClient>
  );
}
