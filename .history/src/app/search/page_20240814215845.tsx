import { type Metadata } from 'next';
import { Gallery } from 'react-grid-gallery';

import { MainLayout } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';

import { PostThumbnail } from './_components/PostThumbnail';

export const metadata: Metadata = {
  title: 'Search - Gallery',
};

export default async function Search() {
  const posts = await api.post.find();

  return (
    <HydrateClient>
      <MainLayout.Body>
        {/*<div className="flex gap-4 flex-wrap">
          {posts.map(post => (
            <PostThumbnail key={post._id} post={post} />
          ))}
        </div>*/}

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
      </MainLayout.Body>
    </HydrateClient>
  );
}
