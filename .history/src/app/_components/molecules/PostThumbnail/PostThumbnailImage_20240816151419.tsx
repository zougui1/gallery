import Image from 'next/image';

import { usePostThumbnail } from './context';
import { PostContentIcon } from './_internal';

export const PostThumbnailImage = () => {
  const { post } = usePostThumbnail();

  return (
    <div>
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
