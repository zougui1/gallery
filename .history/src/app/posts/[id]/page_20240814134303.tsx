import { MainLayout, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';
import { PostImage } from './_components/PostImage';

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
            <PostImage
              src={`/api/media/${post.file.fileName}`}
              alt={post.keywords.join(', ')}
            />
          )}
        </div>
      </MainLayout.Body>

      {post && (
        <MainLayout.SidePanel className="w-64">
          {post.keywords.join(', ')}
        </MainLayout.SidePanel>
      )}
    </HydrateClient>
  );
}
