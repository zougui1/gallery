import { DateTime } from 'luxon';

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
            <div className="flex flex-col">
              <PostImage
                src={`/api/media/${post.file.fileName}`}
                alt={post.keywords.join(', ')}
              />

              <div className="flex">
                {post.author && (
                  <img
                    src={post.author.avatar}
                    alt="Avatar"
                  />
                )}

                <div className="flex flex-col">
                  <Typography.H3>{post.title}</Typography.H3>

                  <div>
                    <Typography.Span>
                      {post.author && (
                        <>
                          By <strong>{post.author.name}{', '}</strong>
                        </>
                      )}

                      posted {DateTime.fromJSDate(post.postedAt).toRelative()}
                    </Typography.Span>
                  </div>
                </div>
              </div>
            </div>
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
