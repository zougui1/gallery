'use client';

import Image from 'next/image';

import { cn } from '@zougui/react.ui';

import { PostRating } from '~/enums';

import { usePostThumbnail } from './context';
import { PostContentIcon } from './_internal';
import { useState } from 'react';
import { useWindowEvent } from '~/app/_hooks';

export const PostThumbnailImage = ({ className, children, ...rest }: PostThumbnailImageProps) => {
  const { post } = usePostThumbnail();
  const [hide, setHide] = useState(true);

  useWindowEvent('blur', () => setHide(true));
  useWindowEvent('focus', () => setHide(false));

  return (
    <div
      {...rest}
      className={cn(
        'relative border shadow-[0px_1px_4px_var(--tw-shadow-color)] rounded-md transition-all max-w-full block',
        'lg:hover:brightness-90 lg:hover:shadow-[0px_2px_6px_var(--tw-shadow-color)]',
        post.rating === PostRating.sfw && 'border-gray-600/90 shadow-gray-700 lg:hover:shadow-gray-700',
        post.rating === PostRating.nsfw && 'border-red-600/90 shadow-red-700 lg:hover:shadow-red-700',
        rest.onClick && 'cursor-pointer',
        //! don't ship to production
        //@ts-expect-error
        //! don't ship to production
        hide && 'blur-lg brightness-[85%]',
        className,
      )}
    >
      <picture>
        <source srcSet={`/api/media/${post.thumbnail.small.fileName}`} />
        <Image
          src={`/api/media/${post.thumbnail.original.fileName}`}
          alt={post.keywords.join(', ')}
          className="w-full h-ful h-48 object-cover rounded-md select-none"
          width={post.thumbnail.small.width}
          height={post.thumbnail.small.height}
        />
      </picture>

      <PostContentIcon post={post} />

      {children}
    </div>
  );
}

export interface PostThumbnailImageProps extends React.HTMLAttributes<HTMLDivElement> {

}
