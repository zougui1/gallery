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
            <div className="flex flex-col gap-4">
              <PostImage
                src={`/api/media/${post.file.fileName}`}
                alt={post.keywords.join(', ')}
              />

              <div className="flex gap-2 h-[70px]">
                {post.author && (
                  <div>
                    <img
                      src={post.author.avatar}
                      alt="Avatar"
                      width={70}
                      height={70}
                    />
                  </div>
                )}

                <div className="flex flex-col">
                  <Typography.Span className="text-md">{post.title}</Typography.Span>

                  <div>
                    <Typography.Span>
                      {post.author && (
                        <>
                          By <strong>{post.author.name}{', '}</strong>
                        </>
                      )}

                      posted
                      <strong>
                        {' '}<RelativeDate date={post.postedAt} format="long" />
                      </strong>
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
