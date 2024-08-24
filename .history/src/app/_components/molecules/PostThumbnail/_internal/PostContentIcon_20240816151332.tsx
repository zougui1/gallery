'use client';

import { FileText, FileVideo, ImagePlay, type LucideProps } from 'lucide-react';

import { PostType } from '~/enums';

const getIconComponent = (contentType: PostType, fileType: string): Icon | undefined => {
  if (contentType === PostType.animation) {
    if (fileType.startsWith('image/')) {
      return ImagePlay;
    }

    return FileVideo;
  }

  if (contentType === PostType.story) {
    return FileText;
  }
}

export const PostContentIcon = ({ contentType, fileType }: PostContentIconProps) => {
  const Icon = getIconComponent(contentType, fileType);

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
  fileType: string;
  contentType: PostType;
}

type Icon = (
  & React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'>
  & React.RefAttributes<SVGSVGElement>>
);
