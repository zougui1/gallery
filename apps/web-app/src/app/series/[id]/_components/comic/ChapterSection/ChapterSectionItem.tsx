'use client';

import { type PostSchemaWithId } from '~/server/database';

import { PageThumbnail } from '../PageThumbnail';

export const ChapterSectionItem = ({ post }: ChapterSectionItemProps) => {
  return (
    <PageThumbnail.Root post={post}>
      <PageThumbnail.Image />

      <PageThumbnail.Caption>
        <PageThumbnail.Title />
        <PageThumbnail.Dropdown />
      </PageThumbnail.Caption>
    </PageThumbnail.Root>
  );
}

export interface ChapterSectionItemProps {
  post: PostSchemaWithId;
}
