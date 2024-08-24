import { type Metadata } from 'next';
import LinkParser from 'react-link-parser';

import { IconButton, MainLayout, Paper, Separator, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';
import { RelativeDate } from '~/app/_components/molecules/RelativeDate';

import { PostImage } from './_components/PostImage';
import { AppLink } from '~/app/_components/atoms/AppLink';
import { Cross, Plus, Trash2, X } from 'lucide-react';
import { KeywordList } from './_components/KeywordList';
import Image from 'next/image';

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
                width={'width' in post.file ? post.file.width : undefined}
                height={'height' in post.file ? post.file.height : undefined}
              />

              <Paper className="flex flex-col gap-4">
                <div className="flex gap-2 h-[70px]">
                  {post.author && (
                    <div>
                      <AppLink.External href={post.author.url} className="block">
                        <Image
                          src={post.author.avatar}
                          alt="Avatar"
                          width={70}
                          height={70}
                          unoptimized
                        />
                      </AppLink.External>
                    </div>
                  )}

                  <div className="flex flex-col">
                    <Typography.H6 className="text-md">{post.title}</Typography.H6>

                    <div>
                      <Typography.Span>
                        {post.author && (
                          <>
                            By{' '}
                            <Image
                              src="/furaffinity-favicon.ico"
                              alt="FA"
                              title="Furaffinity"
                              className="inline"
                              width={16}
                              height={16}
                              unoptimized
                            />
                            {' '}
                            <AppLink.External href={post.author.url}>
                              <strong>{post.author.name}{', '}</strong>
                            </AppLink.External>
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
                  <LinkParser
                    watchers={[
                      {
                        watchFor: "link",
                        render: (url) => (
                          <AppLink.External href={url}>
                            {url}
                          </AppLink.External>
                        ),
                      },
                    ]}
                  >
                    {post.description}
                  </LinkParser>
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
