import { DateTime } from 'luxon';

import { MainLayout, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';
import { PostImage } from './_components/PostImage';
import { RelativeDate } from '~/app/_components/molecules/RelativeDate';

type PostProps = {
  params: {
    id: string;
  };
};

const getRelative

export default async function Post({ params }: PostProps) {
  const post = await api.post.findById({ id: params.id });

  const rtf = new Intl.RelativeTimeFormat('en', { style: 'short' });

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

                      posted <RelativeDate date={post.postedAt} />
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
