'use client';

import { useEffect, useRef } from 'react';

import { type PostSchemaWithId } from '~/server/database';

import { SearchGalleryItem } from './SearchGalleryItem';

export const SearchGallery = ({ posts }: SearchGalleryProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
  }, [posts]);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center gap-4 flex-wrap md:max-h-[calc(100vh-180px)] md:overflow-y-auto"
    >
      <div className="w-full sticky top-0 z-50 h-1.5 shadow-inner shadow-black" />
      {posts.map(post => <SearchGalleryItem key={post._id} post={post} />)}
    </div>
  );
}

export interface SearchGalleryProps {
  posts: PostSchemaWithId[];
}
