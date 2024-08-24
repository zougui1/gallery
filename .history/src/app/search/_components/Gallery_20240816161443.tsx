'use client';

import { useState } from 'react';

import { PostThumbnail } from '~/app/_components/molecules/PostThumbnail';
import { type PostSchemaWithId } from '~/server/database';

export const Gallery = ({ posts }: GalleryProps) => {
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);

  const togglePostId = (id: string) => {
    setSelectedPostIds(prevSelectedPostIds => {
      if (!prevSelectedPostIds.includes(id)) {
        return [...prevSelectedPostIds, id];
      }

      return prevSelectedPostIds.filter(selectedPostId => selectedPostId !== id);
    });
  }

  return (
    <div className="relative flex justify-center gap-4 flex-wrap md:max-h-[calc(100vh-180px)] overflow-y-auto">
      <div className="w-full sticky top-0 z-50 h-1.5 shadow-inner shadow-black" />

      {posts.map(post => (
        <PostThumbnail.Root key={post._id} post={post}>
          <PostThumbnail.Image
            //onClick={() => togglePostId(post._id)}
            selected={selectedPostIds.includes(post._id)}
          />

          <PostThumbnail.Title />
        </PostThumbnail.Root>
      ))}
    </div>
  );
}

export interface GalleryProps {
  posts: PostSchemaWithId[];
}
