'use client';

import { Gallery } from 'react-grid-gallery';

import { type PostSchemaWithId } from '~/server/database';

export const PostGallery = ({ posts }: PostGalleryProps) => {
  return (
    <Gallery
      images={posts.map(post => {
        return {
          src: `/api/media/${post.thumbnail.small.fileName}`,
          width: post.thumbnail.small.width,
          height: post.thumbnail.small.height,
          caption: post.title,
        };
      })}
    />
  );
}

export interface PostGalleryProps  {
  posts: PostSchemaWithId[];
}
