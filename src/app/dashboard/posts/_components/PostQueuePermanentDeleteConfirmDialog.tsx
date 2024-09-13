'use client';

import { AlertDialog, type AlertDialogRootProps } from '@zougui/react.ui';

import { type PostQueueSchemaWithId } from '~/server/database';

import { PostQueueDetails } from './PostQueueDetails';
import { api } from '~/trpc/react';

export const PostQueuePermanentDeleteConfirmDialog = ({ postQueue, children, ...rest }: PostQueuePermanentDeleteConfirmDialogProps) => {
  const utils = api.useUtils();
  const deletion = api.postQueue.deletePermanently.useMutation({
    onSuccess: async () => {
      await Promise.allSettled([
        utils.postQueue.invalidate(),
        utils.post.invalidate(),
      ]);
    },
  });

  const onDelete = () => {
    deletion.mutate({ id: postQueue._id });
  }

  return (
    <AlertDialog.Root {...rest}>
      {children}

      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be undone. This will permanently delete this post.
          </AlertDialog.Description>
        </AlertDialog.Header>

        <PostQueueDetails post={postQueue} />

        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>

          <AlertDialog.Action
            variant="destructive"
            onClick={onDelete}
          >
            Delete permanently
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

PostQueuePermanentDeleteConfirmDialog.Trigger = AlertDialog.Trigger;

export interface PostQueuePermanentDeleteConfirmDialogProps extends AlertDialogRootProps {
  postQueue: PostQueueSchemaWithId;
}
