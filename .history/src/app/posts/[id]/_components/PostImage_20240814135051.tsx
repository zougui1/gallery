'use client';

import { Dialog, cn } from '@zougui/react.ui';

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
        <Dialog.Content>
          <img
            src={src}
            alt={alt}
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'max-w-[100vw] max-h-[100vh] w-full',
            )}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export interface PostImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {

}
