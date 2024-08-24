import { cn, MainLayout } from '@zougui/react.ui';
import Link from 'next/link';
import { FileText, FileVideo, ImagePlay } from 'lucide-react';

import { PostRating } from '~/enums';

import { api, HydrateClient } from '~/trpc/server';
import { type FileTypeResult } from '~/server/workers/types';
import { PostThumbnail } from './_components/PostThumbnail';

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
            <PostThumbnail key={post._id} post={post} />
          ))}
        </div>
      </MainLayout.Body>
    </HydrateClient>
  );
}
