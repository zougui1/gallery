'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, cn } from '@zougui/react.ui';

import { AppLink } from '~/app/_components/atoms/AppLink';
import { type PostSchemaWithId } from '~/server/database';
import { AddAltsFormDialog } from '~/app/series/[id]/_components/comic/AddAltsFormDialog';
import { api } from '~/trpc/react';

import { ConvertToComicDialog } from './ConvertToComicDialog';

export const PostMetaNavigation = ({ post }: PostMetaNavigationProps) => {
  const [openComicConvertionDialog, setOpenComicConvertionDialog] = useState(false);
  const [openAddAltsDialog, setOpenAddAltsDialog] = useState(false);

  const utils = api.useUtils();
  const router = useRouter();

  const removeAltDataMutation = api.post.removeAltData.useMutation({
    onSuccess: async () => {
      router.refresh();
      await Promise.allSettled([
        utils.postQueue.invalidate(),
        await utils.post.invalidate(),
      ]);
    },
  });

  const excludeFromAltGroup = () => {
    removeAltDataMutation.mutate({
      sourceUrl: post.sourceUrl,
    });
  }

  return (
    <div className="flex items-center gap-4">
      <ConvertToComicDialog
        post={post}
        open={openComicConvertionDialog}
        onOpenChange={setOpenComicConvertionDialog}
      />

      <AddAltsFormDialog
        post={post}
        open={openAddAltsDialog}
        onOpenChange={setOpenAddAltsDialog}
      />

      {post.series && (
        <AppLink.Internal href={`/series/${post.series.id}`}>
          <span className="capitalize">{post.series.type}</span>
          {` - ${post.series.name}`}
        </AppLink.Internal>
      )}

      <div
        className={cn(
          'flex items-center gap-4',
          post.series && 'border-l border-gray-400 pl-4',
        )}
      >
        {!post.series && (
          <Button onClick={() => setOpenComicConvertionDialog(true)}>Convert to a comic</Button>
        )}

        <Button onClick={() => setOpenAddAltsDialog(true)}>Add alts</Button>
      </div>

      {post.alt && (
        <div
          className={cn(
            'flex items-center gap-4',
            post.series && 'border-l border-gray-400 pl-4',
          )}
        >
          <Button onClick={excludeFromAltGroup} variant="destructive">Exclude from group of alts</Button>
        </div>
      )}
    </div>
  );
}

export interface PostMetaNavigationProps {
  post: PostSchemaWithId;
}
