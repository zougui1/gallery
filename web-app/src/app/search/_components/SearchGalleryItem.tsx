'use client';

import { Checkbox, cn } from '@zougui/react.ui';
import { Book, BookText, Images, type LucideIcon } from 'lucide-react';

import { ImageIcon } from '~/app/_components/atoms/ImageIcon';
import { PostSelector } from '~/app/_components/organisms/PostSelector';
import { PostThumbnail } from '~/app/_components/organisms/PostThumbnail';
import { PostType } from '~/enums';
import { type PostSchemaWithId } from '~/server/database';

const getIcon = (post: PostSchemaWithId): LucideIcon | undefined => {
  if (post.series) {
    return post.contentType === PostType.story ? BookText : Book;
  }

  if (post.alt) {
    return Images;
  }
}

export const SearchGalleryItem = ({ post }: SearchGalleryItemProps) => {
  const { getSelectionType } = PostSelector.useState();
  const selectionType = getSelectionType(post);
  const Icon = getIcon(post);

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

              {Icon && selectionType !== 'post' && (
                <ImageIcon>
                  <Icon className="shadow-md w-5 h-5" />
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
