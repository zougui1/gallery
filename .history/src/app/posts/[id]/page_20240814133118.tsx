import { MainLayout, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';

type PostProps = {
  params: {
    id: string;
  };
};

export default async function Post({ params }: PostProps) {
  const post = await api.post.findById({ id: params.id });

  return (
    <HydrateClient>
      <MainLayout.Body>
        <div className="flex gap-4 flex-wrap">
          {!post && (
            <Typography.H1>This post does not exist.</Typography.H1>
          )}

          {post && (
            <img
              src={`/api/media/${post.file.fileName}`}
              alt={post.keywords.join(', ')}
            />
          )}
        </div>
      </MainLayout.Body>
    </HydrateClient>
  );
}
