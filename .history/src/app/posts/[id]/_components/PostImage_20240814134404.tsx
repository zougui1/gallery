'use client';

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

      <Popover.Portal>
        <img
          src={src}
          alt={alt}
          className="max-w-[100vw] max-h-[100vh] w-full"
        />
      </Popover.Portal>
    </Popover.Root>
  );
}

export interface PostImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {

}
