'use client';

import { useState } from 'react';

import { Popover } from '@zougui/react.ui';

export const PostImage = ({ src, alt }: PostImageProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <img
          src={src}
          alt={alt}
        />
      </Popover.Trigger>

      <Popover.Content>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full"
        />
      </Popover.Content>
    </Popover.Root>
  );
}

export interface PostImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {

}
