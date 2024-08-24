'use client';

import { Gallery } from 'react-grid-gallery';

import { type PostSchemaWithId } from '~/server/database';

export const PostGallery = ({ posts }: PostGalleryProps) => {
  return (
    <Gallery
      images={posts.map(post => {
        return {
          src: `/api/media/${post.thumbnail.small.fileName}`,
          width: 200,
          height: 200,
          caption: post.title,
        };
      })}
    />
  );
}

export interface PostGalleryProps  {
  posts: PostSchemaWithId[];
}
