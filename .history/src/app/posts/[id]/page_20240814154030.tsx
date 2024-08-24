import { type Metadata } from 'next';

import { MainLayout, Paper, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';
import { RelativeDate } from '~/app/_components/molecules/RelativeDate';

import { PostImage } from './_components/PostImage';

type PostProps = {
  params: {
    id: string;
  };
};

export const generateMetadata = async ({ params }: PostProps): Promise<Metadata> => {
  const post = await api.post.findById({ id: params.id });

  const titlePrefix = post ? post.title : 'Post not found';

  return {
    title: `${titlePrefix} - Gallery`,
    description: 'Gallery',
  };
}

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
                  <Typography.H6 className="text-md">{post.title}</Typography.H6>

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

              <Paper>{post.description}</Paper>
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
