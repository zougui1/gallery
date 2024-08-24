'use client';

import Image from 'next/image';

import { cn } from '@zougui/react.ui';

import { PostRating } from '~/enums';

import { usePostThumbnail } from './context';
import { PostContentIcon } from './_internal';

export const PostThumbnailImage = () => {
  const { post } = usePostThumbnail();

  return (
    <div
      className={cn(
        'relative border shadow-[0px_1px_4px_var(--tw-shadow-color)] rounded-md transition-all max-w-full block',
        'hover:brightness-90 hover:shadow-[0px_2px_6px_var(--tw-shadow-color)] hover:scale-[1.02]',
        post.rating === PostRating.sfw && 'border-gray-600/50 shadow-gray-700/60 hover:shadow-gray-700/60',
        post.rating === PostRating.nsfw && 'border-red-600/50 shadow-red-700/60 hover:shadow-red-700/60',
        'border-blue-600/50 shadow-blue-700/60 hover:shadow-blue-700/60',
      )}
    >
      <picture>
        <source srcSet={`/api/media/${post.thumbnail.small.fileName}`} />
        <Image
          src={`/api/media/${post.thumbnail.original.fileName}`}
          alt={post.keywords.join(', ')}
          className="w-full h-ful h-48 object-cover rounded-md"
          width={post.thumbnail.small.width}
          height={post.thumbnail.small.height}
        />
      </picture>

      <PostContentIcon
        contentType={post.contentType}
        fileType={post.file.contentType}
      />
    </div>
  );
}
