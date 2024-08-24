'use client';

import { useState } from 'react';

import { Dialog, cn } from '@zougui/react.ui';

import { PostThumbnail } from '~/app/_components/organisms/PostThumbnail';
import { type PostSchemaWithId } from '~/server/database';

export const Gallery = ({ posts }: GalleryProps) => {
  const [currentPost, setCurrentPost] = useState<PostSchemaWithId | undefined>();

  return (
    <div className="relative flex justify-center gap-4 flex-wrap md:max-h-[calc(100vh-180px)] overflow-y-auto">
      <div className="w-full sticky top-0 z-50 h-1.5 shadow-inner shadow-black" />

      {posts.map(post => (
        <PostThumbnail.Root key={post._id} post={post}>
          <PostThumbnail.Image onClick={() => setCurrentPost(post)} />

          <PostThumbnail.Title />
        </PostThumbnail.Root>
      ))}

      {currentPost && (
        <Dialog.Primitive.Root
          open
          onOpenChange={() => setCurrentPost(undefined)}
        >
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
                <Dialog.Primitive.Title hidden>Full window image</Dialog.Primitive.Title>
                <Dialog.Primitive.Description hidden>Full window image</Dialog.Primitive.Description>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/media/${currentPost.file.fileName}`}
                  alt={currentPost.keywords.join(', ')}
                  className="max-w-[100vw] max-h-[100vh] cursor-pointer"
                  autoFocus
                />
              </Dialog.Primitive.Content>
            </Dialog.Primitive.Close>
          </Dialog.Primitive.Portal>
        </Dialog.Primitive.Root>
      )}
    </div>
  );
}

export interface GalleryProps {
  posts: PostSchemaWithId[];
}
