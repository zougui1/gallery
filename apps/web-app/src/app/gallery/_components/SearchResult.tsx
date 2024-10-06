import { Typography } from '@zougui/react.ui';

import { ButtonLink } from '~/app/_components/atoms/ButtonLink';

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
