import { Typography, cn } from '@zougui/react.ui';
import Link from 'next/link';

import { PostRating, PostType } from '~/enums';
import { type PostSchemaWithId } from '~/server/database';

import { PostContentIcon } from './PostContentIcon';
import Image from 'next/image';

export const PostThumbnail = ({ post }: PostThumbnailProps) => {
  return (
    <figure
      className={cn(
        'space-y-1 relative max-w-max',
        post.contentType === PostType.story && 'min-w-40',
      )}
    >
      <Link
        href={`/posts/${post._id}`}
        className={cn(
          'relative shadow rounded-md transition-all max-w-full block',
          'hover:brightness-90 hover:shadow-md hover:scale-[1.02]',
          post.rating === PostRating.sfw && 'shadow-gray-600/75 hover:shadow-gray-600/50',
          post.rating === PostRating.nsfw && 'shadow-red-600/75 hover:shadow-red-600/50',
        )}
      >
        <picture>
          <source srcSet={`/api/media/${post.thumbnail.small.fileName}`} />
          <Image
            src={`/api/media/${post.thumbnail.original.fileName}`}
            alt={post.keywords.join(', ')}
            className="w-full h-ful h-48 object-cover rounded-md"
            layout='fill'
            fill
            objectFit='contain'
          />
        </picture>

        <PostContentIcon contentType={post.file.contentType} />
      </Link>



      <figcaption className="w-full table-caption caption-bottom break-words">
        <Link href={`/api/media/${post._id}`}>
          <Typography.Paragraph
            className="text-sm font-semibold text-center break-words transition-all text-blue-100 hover:text-foreground"
          >
            {post.title}
          </Typography.Paragraph>
        </Link>
      </figcaption>
    </figure>
  );
}

export interface PostThumbnailProps {
  post: PostSchemaWithId;
}
