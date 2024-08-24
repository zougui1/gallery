'use client';

import { MainLayout, Separator, Typography } from '@zougui/react.ui';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ButtonLink } from '~/app/_components/atoms/ButtonLink';

import { KeywordAutocomplete } from '~/app/_components/organisms/KeywordAutocomplete';
import { PostRating, PostType } from '~/enums';

enum FilterType {
  image = PostType.image,
  story = PostType.story,
  animation = PostType.animation,
  comic = PostType.comic,
}

const allRatings = Object.values(PostRating);
const allTypes = Object.values(FilterType);

export const SearchPanel = () => {
  const searchParams = useSearchParams();
  const urlKeywords = searchParams.get('keywords')?.split(',') ?? [];
  const urlRatings = searchParams.get('ratings')?.split(',') as PostRating[] ?? allRatings;
  const urlTypes = searchParams.get('types')?.split(',') as FilterType[] ?? allTypes;

  const [keywords, setKeywords] = useState<string[]>(urlKeywords);
  const [ratings, setRatings] = useState<PostRating[]>(urlRatings);
  const [types, setTypes] = useState<FilterType[]>(urlTypes);

  const newSearchParams = new URLSearchParams();
  // no need to add the ratings to the query string if there are none or are all present
  const hasRatings = ratings.length && ratings.length !== allRatings.length;
  // no need to add the types to the query string if there are none or are all present
  const hasTypes = types.length && types.length !== allTypes.length;

  if (keywords.length) {
    newSearchParams.set('keywords', keywords.join(','));
  }

  if (hasRatings) {
    newSearchParams.set('ratings', ratings.join(','));
  }

  if (hasTypes) {
    newSearchParams.set('types', types.join(','));
  }

  const toggleRating = (value: PostRating) => {
    setRatings(prevRatings => {
      if (!prevRatings.includes(value)) {
        return [...prevRatings, value];
      }

      return prevRatings.filter(prevRating => prevRating !== value);
    });
  }

  const toggleType = (value: FilterType) => {
    setTypes(prevTypes => {
      if (!prevTypes.includes(value)) {
        return [...prevTypes, value];
      }

      return prevTypes.filter(prevType => prevType !== value);
    });
  }

  const handleSearch = () => {
    if (!hasRatings) {
      setRatings(allRatings);
    }

    if (!hasTypes) {
      setTypes(allTypes);
    }
  }

  return (
    <MainLayout.SidePanel className="md:max-w-80 w-full flex flex-col gap-6">
      <Typography.H6>Search</Typography.H6>

      <div>
        <ButtonLink.Internal
          href={`/search?${newSearchParams.toString()}`}
          onClick={handleSearch}
        >
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

      <div className="w-full flex flex-col">
        <Typography.Span>Search by rating</Typography.Span>

        <div className="flex flex-wrap *:w-1/3">
          <label>
            <input type="checkbox" checked={ratings.includes(PostRating.sfw)} onChange={() => toggleRating(PostRating.sfw)} />
            <span className="ml-2">{PostRating.sfw.toUpperCase()}</span>
          </label>

          <label>
            <input type="checkbox" checked={ratings.includes(PostRating.nsfw)} onChange={() => toggleRating(PostRating.nsfw)} />
            <span className="ml-2">{PostRating.nsfw.toUpperCase()}</span>
          </label>
        </div>
      </div>

      <div className="w-full flex flex-col">
        <Typography.Span>Search by type</Typography.Span>

        <div className="flex flex-wrap *:w-1/3">
          <label>
            <input type="checkbox" checked={types.includes(FilterType.image)} onChange={() => toggleType(FilterType.image)} />
            <span className="ml-2 capitalize">{FilterType.image}</span>
          </label>

          <label>
            <input type="checkbox" checked={types.includes(FilterType.story)} onChange={() => toggleType(FilterType.story)} />
            <span className="ml-2 capitalize">{FilterType.story}</span>
          </label>

          <label>
            <input type="checkbox" checked={types.includes(FilterType.comic)} onChange={() => toggleType(FilterType.comic)} />
            <span className="ml-2 capitalize">{FilterType.comic}</span>
          </label>

          <label>
            <input type="checkbox" checked={types.includes(FilterType.animation)} onChange={() => toggleType(FilterType.animation)} />
            <span className="ml-2 capitalize">{FilterType.animation}</span>
          </label>
        </div>
      </div>

      <Separator />

      <Typography.H6>Navigation</Typography.H6>

      <p>
        2 navigation modes: links, selection
        <br />
        for selection add a link to open a new tab with a gallery view of the selected posts
        <br />
        by clicking on an image you open it full window and can navigate through the gallery using arrow keys
      </p>
    </MainLayout.SidePanel>
  );
}
