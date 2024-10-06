'use client';

import { useState } from 'react';

import { Dialog, Typography, type DialogRootProps, Button, cn, Checkbox, Paper } from '@zougui/react.ui';

import { api } from '~/trpc/react';
import { type PostSchemaWithId } from '~/server/database';

import { PostSelector } from './PostSelector';
import { KeywordAutocomplete } from './KeywordAutocomplete';
import { PostRating, PostType } from '~/enums';
import { SearchGallery } from '~/app/search/_components/SearchGallery';

const SearchResult = ({ page, hasMore, onPageChange, className }: SearchResultProps) => {
  return (
    <div className={cn('flex justify-center items-center gap-4', className)}>
      <Button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>

      <Typography.Span>Search result page #{page}</Typography.Span>

      <Button disabled={!hasMore} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}

interface SearchResultProps {
  hasMore: boolean;
  page: number;
  onPageChange: (page: number) => void;
  className?: string;
}

enum FilterType {
  image = PostType.image,
  story = PostType.story,
  animation = PostType.animation,
  comic = PostType.comic,
}

export const PostSelectorDialog = ({
  // eslint-disable-next-line @typescript-eslint/unbound-method
  onOpenChange,
  onSelectPosts,
  excludeAlts,
  excludeSeries,
  defaultSelectedPosts,
  multiple,
  children,
  ...rest
}: PostSelectorDialogProps) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [ratings, setRatings] = useState<PostRating[]>([]);
  const [types, setTypes] = useState<FilterType[]>([]);
  const [page, setPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState<PostSchemaWithId[]>(defaultSelectedPosts ?? []);

  const [{ posts, hasMore }] = api.post.find.useSuspenseQuery({
    keywords,
    ratings,
    types,
    page,
    excludeAlts,
    excludeSeries,
  });

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

  return (
    <Dialog.Root {...rest} onOpenChange={open => onOpenChange?.(open)}>
      {children}

      <Dialog.Content className="max-w-[min(1400px,calc(100vw-40px))] w-screen">
        <Dialog.Header>
          <Dialog.Title>Post Selector</Dialog.Title>
          <Dialog.Description>Click on a thumbnail to select a post</Dialog.Description>
        </Dialog.Header>

        <Dialog.Body className="flex flex-col-reverse md:flex-row gap-8">
          {posts.length ? (
            <div className="w-full flex flex-col gap-6 h-full">
              <SearchResult
                hasMore={hasMore}
                page={page}
                onPageChange={setPage}
                className="md:hidden"
              />

              <PostSelector.Root
                posts={selectedPosts}
                onPostsChange={setSelectedPosts}
              >
                <SearchGallery posts={posts} />
              </PostSelector.Root>

              <SearchResult
                hasMore={hasMore}
                page={page}
                onPageChange={setPage}
              />
            </div>
          ) : (
            <Typography.H4 className="w-full">There are no search results for your query.</Typography.H4>
          )}

          <Paper className="md:max-w-80 w-full flex flex-col gap-4">
            <Typography.H6>Search</Typography.H6>

            <div className="flex flex-col gap-4">
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
                  <label className="flex items-center">
                    <Checkbox checked={ratings.includes(PostRating.sfw)} onCheckedChange={() => toggleRating(PostRating.sfw)} />
                    <span className="ml-2">{PostRating.sfw.toUpperCase()}</span>
                  </label>

                  <label className="flex items-center">
                    <Checkbox checked={ratings.includes(PostRating.nsfw)} onCheckedChange={() => toggleRating(PostRating.nsfw)} />
                    <span className="ml-2">{PostRating.nsfw.toUpperCase()}</span>
                  </label>
                </div>
              </div>

              <div className="w-full flex flex-col">
                <Typography.Span>Search by type</Typography.Span>

                <div className="flex flex-wrap *:w-1/3">
                  <label className="flex items-center">
                    <Checkbox checked={types.includes(FilterType.image)} onCheckedChange={() => toggleType(FilterType.image)} />
                    <span className="ml-2 capitalize">{FilterType.image}</span>
                  </label>

                  <label className="flex items-center">
                    <Checkbox checked={types.includes(FilterType.story)} onCheckedChange={() => toggleType(FilterType.story)} />
                    <span className="ml-2 capitalize">{FilterType.story}</span>
                  </label>

                  <label className="flex items-center">
                    <Checkbox checked={types.includes(FilterType.comic)} onCheckedChange={() => toggleType(FilterType.comic)} />
                    <span className="ml-2 capitalize">{FilterType.comic}</span>
                  </label>

                  <label className="flex items-center">
                    <Checkbox checked={types.includes(FilterType.animation)} onCheckedChange={() => toggleType(FilterType.animation)} />
                    <span className="ml-2 capitalize">{FilterType.animation}</span>
                  </label>
                </div>
              </div>
            </div>
          </Paper>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline">Close</Button>
          </Dialog.Close>

          <Button onClick={() => onSelectPosts(selectedPosts)}>Select post{multiple ? 's' : ''}</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

PostSelectorDialog.Trigger = Dialog.Trigger;

export interface PostSelectorDialogProps extends DialogRootProps {
  onSelectPosts: (posts: PostSchemaWithId[]) => void;
  defaultSelectedPosts?: PostSchemaWithId[];
  excludeAlts?: boolean;
  excludeSeries?: boolean;
  multiple?: boolean;
}
