'use client';

import { useState } from 'react';

import { Dialog, cn } from '@zougui/react.ui';

import { PostThumbnail } from '~/app/_components/organisms/PostThumbnail';
import { type PostSchemaWithId } from '~/server/database';
import { Loader } from 'lucide-react';

export const Gallery = ({ posts }: GalleryProps) => {
  const [currentPost, setCurrentPost] = useState<PostSchemaWithId | undefined>();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!currentPost) {
      return;
    }

    const postIndex = posts.findIndex(post => post._id === currentPost._id);

    switch (event.key) {
      case 'ArrowLeft':
        setCurrentPost(posts[postIndex === 0 ? posts.length - 1 : (postIndex - 1)]);
        break;
      case 'ArrowRight':
        setCurrentPost(posts[(postIndex + 1) % posts.length]);
        break;
    }
  }

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
                  'focus-visible:outline-none',
                )}
                onKeyDown={handleKeyDown}
              >
                <Dialog.Primitive.Title hidden>Full window image</Dialog.Primitive.Title>
                <Dialog.Primitive.Description hidden>Full window image</Dialog.Primitive.Description>

                <Loader className="w-12 h-12 absolute top-50 left-50 -translate-x-1/2 -translate-y-1/2" />

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/media/${currentPost.file.fileName}`}
                  alt={currentPost.keywords.join(', ')}
                  className="max-w-[100vw] max-h-[100vh] cursor-pointer"
                  ref={e => e?.focus()}
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
