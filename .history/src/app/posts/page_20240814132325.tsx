import { MainLayout } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';
import { PostThumbnail } from './_components/PostThumbnail';

export default async function Home() {
  const posts = await api.post.find();

  return (
    <HydrateClient>
      <MainLayout.Body>
        <div className="flex gap-4 flex-wrap">
          {posts.map(post => (
            <PostThumbnail key={post._id} post={post} />
          ))}
        </div>
      </MainLayout.Body>
    </HydrateClient>
  );
}
