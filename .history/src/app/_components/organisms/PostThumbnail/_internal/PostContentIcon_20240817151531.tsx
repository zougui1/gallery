'use client';

import { FileText, FileVideo, ImagePlay, Images, type LucideProps } from 'lucide-react';

import { PostType } from '~/enums';
import { type PostSchemaWithId } from '~/server/database';

const getIconComponent = (post: PostSchemaWithId): Icon | undefined => {
  if (post.alt) {
    return Images;
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
}

export const PostContentIcon = ({ post }: PostContentIconProps) => {
  const Icon = getIconComponent(post);

  if (!Icon) {
    return null;
  }

  return (
    <Icon
      // prevents link from redirecting when clicking on the icon
      onClick={e => e.preventDefault()}
      className="w-5 h-5 absolute bottom-1.5 right-1.5 bg-black/30 rounded-md drop-shadow-md shadow-md cursor-default"
    />
  )
}

export interface PostContentIconProps {
  post: PostSchemaWithId;
}

type Icon = (
  & React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'>
  & React.RefAttributes<SVGSVGElement>>
);
