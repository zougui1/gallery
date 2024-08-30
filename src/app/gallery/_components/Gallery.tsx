'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide, type SwiperRef, type SwiperClass } from 'swiper/react';
import { Keyboard } from 'swiper/modules';
import 'swiper/css';

import { Dialog, cn } from '@zougui/react.ui';

import { PostThumbnail } from '~/app/_components/organisms/PostThumbnail';
import { type PostSchemaWithId } from '~/server/database';
import { useDocumentEvent } from '~/app/_hooks';

export const Gallery = ({ posts }: GalleryProps) => {
  const [currentPost, setCurrentPost] = useState<PostSchemaWithId | undefined>();
  const swiperRef = useRef<SwiperRef | null>(null);
  const galleryContainerRef = useRef<HTMLDivElement | null>(null);
  const lastActiveIndex = useRef<number | undefined>();

  useEffect(() => {
    // if this use effect is called with no current post
    // and a last active index
    // that means the user has exited full screen
    if (!currentPost && lastActiveIndex.current !== undefined) {
      const postElements = galleryContainerRef.current?.querySelectorAll('figure');
      const activePostElement = postElements?.[lastActiveIndex.current];
      setTimeout(() => activePostElement?.scrollIntoView({ block: 'nearest' }), 50);
    }
  }, [currentPost]);

  useDocumentEvent('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      setCurrentPost(undefined);
    }
  });

  const requestFullScreen = (element: HTMLElement | null): void => {
    element?.requestFullscreen().catch(() => null);
  }

  const handleSlideChange = (swiper: SwiperClass) => {
    if(!galleryContainerRef.current) {
      return;
    }

    lastActiveIndex.current = swiper.activeIndex;
  }

  return (
    <div
      ref={galleryContainerRef}
      className="relative flex justify-center gap-4 flex-wrap md:max-h-[calc(100vh-180px)] overflow-y-auto"
    >
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
                  'w-screen h-screen',
                  'focus-visible:outline-none',
                )}
                ref={requestFullScreen}
              >
                <Dialog.Primitive.Title hidden>Full window image</Dialog.Primitive.Title>
                <Dialog.Primitive.Description hidden>Full window image</Dialog.Primitive.Description>

                <Swiper
                  loop
                  direction="horizontal"
                  className="w-screen h-screen"
                  ref={swiperRef}
                  keyboard={{ enabled: true }}
                  modules={[Keyboard]}
                  initialSlide={posts.findIndex(post => post._id === currentPost._id)}
                  onSlideChange={handleSlideChange}
                >
                  {posts.map(post => (
                    <SwiperSlide key={post._id} className="w-screen h-screen flex justify-center items-center touch-pinch-zoom">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/api/media/${post.file.fileName}`}
                        alt={post.keywords.join(', ')}
                        className={cn(
                          'max-w-[100vw] max-h-[100vh] cursor-pointer touch-pinch-zoom',
                          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                          'bg-gray-800',
                        )}
                        ref={e => e?.focus()}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
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
