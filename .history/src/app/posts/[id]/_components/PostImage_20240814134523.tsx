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
        <img
          src={src}
          alt={alt}
          className="max-w-[100vw] max-h-[100vh] w-full"
        />
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export interface PostImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {

}
