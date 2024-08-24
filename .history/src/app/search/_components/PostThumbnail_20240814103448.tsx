import { Typography, cn } from '@zougui/react.ui';
import Link from 'next/link';

import { PostRating } from '~/enums';
import { type PostSchemaWithId } from '~/server/database';

import { PostContentIcon } from './PostContentIcon';

export const PostThumbnail = ({ post }: PostThumbnailProps) => {
  return (
    <figure className="flex justify-center items-center relative">
      <Link
        href={`/posts/${post._id}`}
        className={cn(
          'relative shadow rounded-md transition-all',
          'hover:brightness-90 hover:shadow-md hover:scale-[1.02]',
          post.rating === PostRating.sfw && 'shadow-gray-600/75 hover:shadow-gray-600/50',
          post.rating === PostRating.nsfw && 'shadow-red-600/75 hover:shadow-red-600/50',
        )}
      >
        <picture>
          <source srcSet={`/api/media/${post.thumbnail.small.fileName}`} />
          <img
            src={`/api/media/${post.thumbnail.original.fileName}`}
            alt={post.keywords.join(', ')}
            className="max-w-96 max-h-96 rounded-md"
          />
        </picture>

        <figcaption>
          <Typography.Paragraph>
            {post.title}
          </Typography.Paragraph>
        </figcaption>

        <PostContentIcon contentType={post.file.contentType} />
      </Link>
    </figure>
  );
}

export interface PostThumbnailProps {
  post: PostSchemaWithId;
}
