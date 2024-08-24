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
  const urlRatings = searchParams.get('ratings')?.split(',');

  const [keywords, setKeywords] = useState<string[]>(urlKeywords);
  const [ratings, setRatings] = useState<Record<PostRating, boolean>>({
    sfw: !urlRatings || urlRatings.includes(PostRating.sfw),
    nsfw: !urlRatings || urlRatings.includes(PostRating.nsfw),
  });

  const toggleRating = (value: PostRating) => {
    setRatings(prevRatings => {
      return {
        ...prevRatings,
        [value]: !prevRatings[value],
      };
    });
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

        <div className="flex gap-8">
          <label>
            <input type="checkbox" checked={ratings[PostRating.sfw]} onChange={() => toggleRating(PostRating.sfw)} />
            <span className="ml-2">{PostRating.sfw.toUpperCase()}</span>
          </label>

          <label>
            <input type="checkbox" checked={ratings[PostRating.nsfw]} onChange={() => toggleRating(PostRating.nsfw)} />
            <span className="ml-2">{PostRating.nsfw.toUpperCase()}</span>
          </label>
        </div>
      </div>
    </MainLayout.SidePanel>
  );
}
