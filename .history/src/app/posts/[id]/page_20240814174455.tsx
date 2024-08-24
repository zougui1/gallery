import { type Metadata } from 'next';
import LinkParser from 'react-link-parser';

import { MainLayout, Paper, Separator, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';
import { RelativeDate } from '~/app/_components/molecules/RelativeDate';

import { PostImage } from './_components/PostImage';
import { AppLink } from '~/app/_components/atoms/AppLink';
import { Trash2 } from 'lucide-react';

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

              <Paper className="flex flex-col gap-4">
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
          <Typography.H5>Keywords</Typography.H5>

          <ul>
            {post.keywords.slice().sort().map(keyword => (
              <li key={keyword} className="flex justify-between">
                <div>
                  <AppLink.Internal href={`/search?keywords=${keyword}`}>
                    {keyword}
                  </AppLink.Internal>
                </div>

                <div>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </div>
              </li>
            ))}
          </ul>
        </MainLayout.SidePanel>
      )}
    </HydrateClient>
  );
}
