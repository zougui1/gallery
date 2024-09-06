'use client';

import { Checkbox, cn } from '@zougui/react.ui';
import { Infinity } from 'lucide-react';

import { ImageIcon } from '~/app/_components/atoms/ImageIcon';
import { PostSelector } from '~/app/_components/organisms/PostSelector';
import { PostThumbnail } from '~/app/_components/organisms/PostThumbnail';
import { type PostSchemaWithId } from '~/server/database';

export const SearchGalleryItem = ({ post }: SearchGalleryItemProps) => {
  const { getSelectionType } = PostSelector.useState();
  const selectionType = getSelectionType(post);

  return (
    <PostThumbnail.Root post={post}>
      <PostSelector.Trigger post={post} asChild>
        <PostThumbnail.Image>
          {selectionType && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <Checkbox
                checked
                className={cn(
                  'shadow-md rounded-full',
                  'border-gray-400 data-[state=checked]:bg-blue-200',
                )}
              />

              {selectionType !== 'post' && (
                <ImageIcon>
                  <Infinity className="shadow-md w-5 h-5" />
                </ImageIcon>
              )}
            </div>
          )}
        </PostThumbnail.Image>
      </PostSelector.Trigger>

      <PostThumbnail.Title />
    </PostThumbnail.Root>
  );
}

export interface SearchGalleryItemProps {
  post: PostSchemaWithId;
}
