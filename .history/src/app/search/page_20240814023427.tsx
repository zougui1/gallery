import { cn, MainLayout } from '@zougui/react.ui';
import Link from 'next/link';
import { FileText, FileVideo, ImagePlay } from 'lucide-react';

import { PostRating } from '~/enums';

import { api, HydrateClient } from '~/trpc/server';
import { type FileTypeResult } from '~/server/workers/types';

const textFileMimeTypes = [
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
  'application/rtf',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.oasis.opendocument.presentation',
  'application/vnd.oasis.opendocument.spreadsheet',
] satisfies FileTypeResult['mime'][] as string[];

export default async function Home() {
  const posts = await api.post.find();

  return (
    <HydrateClient>
      <MainLayout.Body>
        <div className="flex gap-4 flex-wrap">
          {posts.map(post => (
            <div key={post._id} className="flex justify-center items-center relative">
              {
                // TODO link
              }
              <Link href={`/posts/${post._id}`} className="relative">
                <picture>
                  <source srcSet={`/api/media/${post.thumbnail.small.fileName}`} />
                  <img
                    src={`/api/media/${post.thumbnail.original.fileName}`}
                    alt={post.keywords.join(', ')}
                    className={cn(
                      'max-w-96 max-h-96 shadow rounded-md transition-all',
                      'hover:brightness-90 hover:shadow-md hover:scale-[1.02]',
                      post.rating === PostRating.sfw && 'shadow-gray-600/75 hover:shadow-gray-600/50',
                      post.rating === PostRating.nsfw && 'shadow-red-600/75 hover:shadow-red-600/50',
                    )}
                  />
                </picture>

                {post.file.contentType === 'image/gif' && (
                  <ImagePlay
                    className="w-4 h-4 absolute bottom-1 right-1 bg-black/10 drop-shadow shadow"
                  />
                )}

                {post.file.contentType.includes('video/') && (
                  <FileVideo
                    className="w-4 h-4 absolute bottom-1 right-1 bg-black/10 drop-shadow shadow"
                  />
                )}

                {textFileMimeTypes.includes(post.file.contentType) && (
                  <FileText
                    className="w-4 h-4 absolute bottom-1 right-1 bg-black/10 drop-shadow shadow"
                  />
                )}
              </Link>
            </div>
          ))}
        </div>
      </MainLayout.Body>
    </HydrateClient>
  );
}
