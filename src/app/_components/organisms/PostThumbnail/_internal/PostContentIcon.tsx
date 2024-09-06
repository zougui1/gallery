'use client';

import { BookImage, FileText, FileVideo, ImagePlay, Images, type LucideProps } from 'lucide-react';

import { PostType } from '~/enums';
import { ImageIcon } from '~/app/_components/atoms/ImageIcon';
import { type PostSchemaWithId } from '~/server/database';

const getIconComponent = (post: PostSchemaWithId): Icon | undefined => {
  if (post.contentType === PostType.comic) {
    return BookImage;
  }

  if (post.contentType === PostType.animation) {
    if (post.file.contentType.startsWith('image/')) {
      return ImagePlay;
    }

    return FileVideo;
  }

  if (post.contentType === PostType.story) {
    return FileText;
  }

  if (post.alt) {
    return Images;
  }
}

export const PostContentIcon = ({ post }: PostContentIconProps) => {
  const Icon = getIconComponent(post);

  if (!Icon) {
    return null;
  }

  return (
    <ImageIcon>
      <Icon
        // prevents link from redirecting when clicking on the icon
        onClick={e => e.preventDefault()}
        className="absolute bottom-1.5 right-1.5"
      />
    </ImageIcon>
  )
}

export interface PostContentIconProps {
  post: PostSchemaWithId;
}

type Icon = (
  & React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'>
  & React.RefAttributes<SVGSVGElement>>
);
