'use client';

import { Dialog } from '@zougui/react.ui';

export const PostImage = ({ src, alt }: PostImageProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <img
          src={src}
          alt={alt}
        />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay />
        <img
          src={src}
          alt={alt}
          className="absolute top-1/2 left-1/2 max-w-[100vw] max-h-[100vh] w-full"
        />
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export interface PostImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {

}
