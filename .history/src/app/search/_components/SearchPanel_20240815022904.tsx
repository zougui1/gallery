'use client';

import { MainLayout, Typography } from '@zougui/react.ui';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ButtonLink } from '~/app/_components/atoms/ButtonLink';

import { KeywordAutocomplete } from '~/app/_components/organisms/KeywordAutocomplete';
import { PostRating } from '~/enums';

export const SearchPanel = () => {
  const searchParams = useSearchParams();
  const urlKeywords = searchParams.get('keywords')?.split(',') ?? [];

  const [keywords, setKeywords] = useState<string[]>(urlKeywords);
  const [ratings, setRatings] = useState<PostRating[]>([]);

  const toggleRating = (value: PostRating) => {
    setRatings(prevRatings => {
      if (!prevRatings.includes(value)) {
        return [...prevRatings, value];
      }

      return prevRatings.filter(prevRating => prevRating !== value);
    })
  }

  return (
    <MainLayout.SidePanel className="max-w-64 w-full flex flex-col gap-6">
      <div>
        <ButtonLink.Internal href={`/search?keywords=${keywords.join(',')}`}>
          Search
        </ButtonLink.Internal>
      </div>

      <div>
        <KeywordAutocomplete
          values={keywords}
          onValuesChange={keywords => setKeywords(keywords.map(String))}
          placeholder="Keywords"
          multiple
        />
      </div>

      <div className="flex flex-col">
        <Typography.Span>Search by rating</Typography.Span>

        <label>
          <input type="checkbox" checked={ratings.includes(PostRating.sfw)} onChange={() => toggleRating(PostRating.sfw)} />
          <span>{PostRating.sfw.toUpperCase()}</span>
        </label>

        <label>
          <input type="checkbox" checked={ratings.includes(PostRating.nsfw)} onChange={() => toggleRating(PostRating.nsfw)} />
          <span>{PostRating.nsfw.toUpperCase()}</span>
        </label>
      </div>
    </MainLayout.SidePanel>
  );
}
