import { MainLayout } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';

export default async function Home() {
  const posts = await api.post.find();

  return (
    <HydrateClient>
      <MainLayout.Body>
        <div className="flex gap-4 flex-wrap">
          {posts.map(post => (
            <div key={post._id}>
              <picture>
                <source srcSet={`/api/media/${post.thumbnail.small.fileName}`} />
                <img
                  src={`/api/media/${post.thumbnail.original.fileName}`}
                  alt={post.keywords.join(', ')}
                  className="max-w-80 max-h-80"
                />
              </picture>
            </div>
          ))}
        </div>
      </MainLayout.Body>
    </HydrateClient>
  );
}
