'use client';

import { MainLayout, Separator, Typography, Checkbox } from '@zougui/react.ui';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ButtonLink } from '~/app/_components/atoms/ButtonLink';

import { KeywordAutocomplete } from '~/app/_components/organisms/KeywordAutocomplete';
import { PostSelector } from '~/app/_components/organisms/PostSelector';
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
  const { posts: selectedPosts } = PostSelector.useState();

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
    <MainLayout.SidePanel className="md:max-w-80 w-full space-y-4">
      <div>
        <Typography.H6>Search</Typography.H6>

        <div className="flex flex-col gap-4">
          <div>
            <ButtonLink.Internal
              href={`/search?${newSearchParams.toString()}`}
              onClick={handleSearch}
              size="sm"
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
                <Checkbox checked={ratings.includes(PostRating.sfw)} onChange={() => toggleRating(PostRating.sfw)} />
                <span className="ml-2">{PostRating.sfw.toUpperCase()}</span>
              </label>

              <label>
                <Checkbox checked={ratings.includes(PostRating.nsfw)} onChange={() => toggleRating(PostRating.nsfw)} />
                <span className="ml-2">{PostRating.nsfw.toUpperCase()}</span>
              </label>
            </div>
          </div>

          <div className="w-full flex flex-col">
            <Typography.Span>Search by type</Typography.Span>

            <div className="flex flex-wrap *:w-1/3">
              <label>
                <Checkbox checked={types.includes(FilterType.image)} onChange={() => toggleType(FilterType.image)} />
                <span className="ml-2 capitalize">{FilterType.image}</span>
              </label>

              <label>
                <Checkbox checked={types.includes(FilterType.story)} onChange={() => toggleType(FilterType.story)} />
                <span className="ml-2 capitalize">{FilterType.story}</span>
              </label>

              <label>
                <Checkbox checked={types.includes(FilterType.comic)} onChange={() => toggleType(FilterType.comic)} />
                <span className="ml-2 capitalize">{FilterType.comic}</span>
              </label>

              <label>
                <Checkbox checked={types.includes(FilterType.animation)} onChange={() => toggleType(FilterType.animation)} />
                <span className="ml-2 capitalize">{FilterType.animation}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <Typography.H6>Navigation</Typography.H6>

        <div className="space-y-4">
          <PostSelector.Link href={`/gallery?posts=${selectedPosts.map(p => p._id).join(',')}`}>
            Open gallery with selected posts ({selectedPosts.length})
          </PostSelector.Link>

          <PostSelector.Clear size="sm" />
        </div>
      </div>
    </MainLayout.SidePanel>
  );
}
