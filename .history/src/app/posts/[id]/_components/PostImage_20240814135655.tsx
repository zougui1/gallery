'use client';

import { Dialog, cn } from '@zougui/react.ui';

export const PostImage = ({ src, alt }: PostImageProps) => {
  return (
    <Dialog.Primitive.Root>
      <Dialog.Primitive.Trigger asChild>
        <img
          src={src}
          alt={alt}
        />
      </Dialog.Primitive.Trigger>

      <Dialog.Primitive.Portal>

        <Dialog.Primitive.Close asChild>
          <Dialog.Primitive.Content className="max-w-[100vw] max-h-[100vh]">
            <img
              src={src}
              alt={alt}
              className={cn(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'max-w-[100vw] max-h-[100vh]',
              )}
            />
          </Dialog.Primitive.Content>
        </Dialog.Primitive.Close>
      </Dialog.Primitive.Portal>
    </Dialog.Primitive.Root>
  );
}

export interface PostImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {

}
