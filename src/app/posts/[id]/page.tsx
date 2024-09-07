import { type Metadata } from 'next';

import { MainLayout, Paper, Separator, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';
import { RelativeDate } from '~/app/_components/molecules/RelativeDate';

import { PostImage } from './_components/PostImage';
import { KeywordList } from './_components/KeywordList';
import { PostDescription } from '~/app/_components/molecules/PostDescription';
import { PostAvatar } from '~/app/_components/molecules/PostAvatar';
import { PostAuthor } from '~/app/_components/molecules/PostAuthor';

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
      <MainLayout.Body className="w-full">
        <div className="w-full flex gap-4 flex-wrap">
          {!post && (
            <Typography.H1>This post does not exist.</Typography.H1>
          )}

          {post && (
            <div className="w-full flex flex-col gap-4">
              <PostImage
                src={`/api/media/${post.file.fileName}`}
                alt={post.keywords.join(', ')}
                width={'width' in post.file ? post.file.width : undefined}
                height={'height' in post.file ? post.file.height : undefined}
                className="mx-auto"
              />

              <Paper className="w-full flex flex-col gap-4">
                <div className="flex gap-2 h-[70px]">
                  {post.author && (
                    <div>
                      <PostAvatar
                        href={post.author.url}
                        src={post.author.avatar}
                      />
                    </div>
                  )}

                  <div className="flex flex-col">
                    <Typography.H6 className="text-md">{post.title}</Typography.H6>

                    <div>
                      <Typography.Span>
                        {post.author && (
                          <>
                            By{' '}
                            <PostAuthor
                              sourceUrl={post.sourceUrl}
                              authorUrl={post.author.url}
                              name={post.author.name}
                            />
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

                <Separator />

                <div>
                  <PostDescription text={post.description} />
                </div>
              </Paper>
            </div>
          )}
        </div>
      </MainLayout.Body>

      {post && (
        <MainLayout.SidePanel className="w-64">
          <KeywordList post={post} />
        </MainLayout.SidePanel>
      )}
    </HydrateClient>
  );
}
