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
        'space-y-1 relative max-w-48 w-full h-48',
        post.contentType === PostType.story && 'min-w-40',
      )}
    >
        <picture>
          <source srcSet={`/api/media/${post.thumbnail.small.fileName}`} />
          <Image
            src={`/api/media/${post.thumbnail.original.fileName}`}
            alt={post.keywords.join(', ')}
            className="w-auto object-cover rounded-md"
            fill
          />
        </picture>

        <PostContentIcon contentType={post.file.contentType} />



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
