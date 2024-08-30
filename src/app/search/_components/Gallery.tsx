'use client';

import { useEffect, useRef } from 'react';

import { PostSelector } from '~/app/_components/organisms/PostSelector';
import { PostThumbnail } from '~/app/_components/organisms/PostThumbnail';
import { type PostSchemaWithId } from '~/server/database';

export const Gallery = ({ posts }: GalleryProps) => {
  const { posts: selectedPosts } = PostSelector.useState();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
  }, [posts]);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center gap-4 flex-wrap md:max-h-[calc(100vh-180px)] overflow-y-auto"
    >
      <div className="w-full sticky top-0 z-50 h-1.5 shadow-inner shadow-black" />

      {posts.map(post => (
        <PostThumbnail.Root key={post._id} post={post}>
          <PostSelector.Trigger post={post} asChild>
            <PostThumbnail.Image
              selected={selectedPosts.some(p => p._id === post._id)}
            />
          </PostSelector.Trigger>

          <PostThumbnail.Title />
        </PostThumbnail.Root>
      ))}
    </div>
  );
}

export interface GalleryProps {
  posts: PostSchemaWithId[];
}
