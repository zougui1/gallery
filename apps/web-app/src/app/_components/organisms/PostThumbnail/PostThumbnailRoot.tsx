'use client';

import { cn } from '@zougui/react.ui';
import { PostType } from '@zougui/gallery.enums';

import { PostThumbnailProvider, type PostThumbnailProviderProps } from './context';

export const PostThumbnailRoot = ({ children, post }: PostThumbnailRootProps) => {
  return (
    <PostThumbnailProvider post={post}>
      <figure
        className={cn(
          'space-y-1 max-w-max',
          post.contentType === PostType.story && 'min-w-40',
        )}
      >
        {children}
      </figure>
    </PostThumbnailProvider>
  );
}

export interface PostThumbnailRootProps extends PostThumbnailProviderProps {

}
