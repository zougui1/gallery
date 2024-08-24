import { type Metadata } from 'next';

import { MainLayout, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';
import { ButtonLink } from '~/app/_components/atoms/ButtonLink';

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

export const SearchResult = ({ searchParams, hasMore }: SearchResultProps) => {
  const prevParams = new URLSearchParams({
    page: String(searchParams.page - 1),
  });
  const nextParams = new URLSearchParams({
    page: String(searchParams.page + 1),
  });

  if(searchParams.keywords) {
    prevParams.set('keywords', searchParams.keywords.join(','));
    nextParams.set('keywords', searchParams.keywords.join(','));
  }

  return (
    <div className="flex justify-center items-center gap-4">
      <ButtonLink.Internal
        disabled={searchParams.page <= 1}
        href={`/search?${prevParams.toString()}`}
      >
        Previous
      </ButtonLink.Internal>

      <Typography.Span>Search result page #{searchParams.page}</Typography.Span>

      <ButtonLink.Internal
        disabled={!hasMore}
        href={`/search?${nextParams.toString()}`}
      >
        Next
      </ButtonLink.Internal>
    </div>
  );
}

export interface SearchResultProps {
  hasMore: boolean;

  searchParams: {
    page: number;
    keywords?: string[];
  };
}

export default async function Search(props: SearchProps) {
  const searchParams = {
    keywords: props.searchParams.keywords?.split(',').filter(Boolean),
    page: Number(props.searchParams.page) || 1,
  };

  const { posts, hasMore } = await api.post.find(searchParams);

  return (
    <HydrateClient>
      <MainLayout.Body className="gap-8">
        <SearchResult hasMore={hasMore} searchParams={searchParams} />

        <div className="flex gap-4 flex-wrap">
          {posts.map(post => (
            <PostThumbnail key={post._id} post={post} />
          ))}
        </div>

        <SearchResult hasMore={hasMore} searchParams={searchParams} />
      </MainLayout.Body>

      <SearchPanel />
    </HydrateClient>
  );
}
