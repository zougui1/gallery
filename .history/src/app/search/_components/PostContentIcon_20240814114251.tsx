'use client';

import { FileText, FileVideo, ImagePlay, type LucideProps } from 'lucide-react';

import { type FileTypeResult } from '~/server/workers/types';

const textFileMimeTypes = [
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
  'application/rtf',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.oasis.opendocument.presentation',
  'application/vnd.oasis.opendocument.spreadsheet',
] satisfies FileTypeResult['mime'][] as string[];

const getIconComponent = (contentType: string): Icon | undefined => {
  if (contentType === 'image/gif') {
    return ImagePlay;
  }

  if (contentType.includes('video/')) {
    return FileVideo;
  }

  if (textFileMimeTypes.includes(contentType)) {
    return FileText;
  }
}

export const PostContentIcon = ({ contentType }: PostContentIconProps) => {
  const Icon = getIconComponent(contentType);

  if (!Icon) {
    return null;
  }

  return (
    <Icon
      // prevents link from redirecting when clicking on the icon
      onClick={e => e.preventDefault()}
      className="w-6 h-6 absolute bottom-2 right-2 bg-black/10 drop-shadow shadow cursor-default"
    />
  )
}

export interface PostContentIconProps {
  contentType: string;
}

type Icon = (
  & React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'>
  & React.RefAttributes<SVGSVGElement>>
);
