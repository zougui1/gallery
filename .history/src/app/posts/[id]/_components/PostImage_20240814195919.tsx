'use client';

import { Dialog, cn } from '@zougui/react.ui';
import Image from 'next/image';

export const PostImage = ({ src, alt, width, height }: PostImageProps) => {
  return (
    <Dialog.Primitive.Root>
      <Dialog.Primitive.Trigger asChild>
        <Image
          src={src}
          alt={alt}
          className="cursor-pointer"
          width={width ?? 0}
          height={height ?? 0}
        />
      </Dialog.Primitive.Trigger>

      <Dialog.Primitive.Portal>
        <Dialog.Overlay />

        <Dialog.Primitive.Close asChild>
          <Dialog.Primitive.Content
            className={cn(
              'fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'flex justify-center items-center',
              'max-w-[100vw] max-h-[100vh] w-full',
            )}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-[100vw] max-h-[100vh] cursor-pointer"
            />
          </Dialog.Primitive.Content>
        </Dialog.Primitive.Close>
      </Dialog.Primitive.Portal>
    </Dialog.Primitive.Root>
  );
}

export interface PostImageProps extends React.ComponentProps<typeof Image> {

}
/*
export interface PostImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {

}
*/
