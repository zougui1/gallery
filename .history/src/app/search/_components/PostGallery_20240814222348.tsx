'use client';

import { Gallery } from 'react-grid-gallery';

import { type PostSchemaWithId } from '~/server/database';

export const PostGallery = ({ posts }: PostGalleryProps) => {
  return (
    <div className="w-[1000px]">

      <Gallery
        images={posts.map(post => {
          return {
            src: `/api/media/${post.thumbnail.small.fileName}`,
            width: post.thumbnail.small.width,
            height: post.thumbnail.small.height,
            thumbnailCaption: post.title,
          };
        })}
        thumbnailImageComponent={props => {
          if(props.imageProps.src === '/api/media/yJFZ4xnJgr_vjczoTeWNN-thumbnail.avif')
          console.log(props.imageProps.style)
          return (
            <img {...props.imageProps} />
          );
        }}
        enableImageSelection={false}
      />
    </div>
  );
}

export interface PostGalleryProps  {
  posts: PostSchemaWithId[];
}
