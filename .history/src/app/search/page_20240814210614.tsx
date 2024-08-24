import { type Metadata } from 'next';

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
        <div
          //className="flex gap-4 flex-wrap"
          className="grid grid-cols-[repeat(auto-fit,33%)]"
        >
          {posts.map(post => (
            <PostThumbnail key={post._id} post={post} />
          ))}
        </div>
      </MainLayout.Body>
    </HydrateClient>
  );
}
