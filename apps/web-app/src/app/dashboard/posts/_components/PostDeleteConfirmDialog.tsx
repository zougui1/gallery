'use client';

import { AlertDialog, type AlertDialogRootProps } from '@zougui/react.ui';

import { type PostQueueSchemaWithId } from '~/server/database';

import { PostQueueDetails } from './PostQueueDetails';
import { api } from '~/trpc/react';
import { useMountedRef } from '~/app/_hooks';

export const PostDeleteConfirmDialog = ({ postQueue, children, onDeleted, ...rest }: PostDeleteConfirmDialogProps) => {
  const mountedRef = useMountedRef();

  const utils = api.useUtils();
  const deletion = api.postQueue.delete.useMutation({
    onSuccess: async () => {
      if (mountedRef.current) {
        onDeleted?.();
      }

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
          <AlertDialog.Title>Are you sure?</AlertDialog.Title>
          <AlertDialog.Description>
            This will delete this post from the servers. The post may no longer be recovered if the source URL is no longer accessible or has been deleted.
          </AlertDialog.Description>
        </AlertDialog.Header>

        {postQueue && <PostQueueDetails post={postQueue} />}

        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>

          <AlertDialog.Action
            variant="destructive"
            onClick={onDelete}
          >
            Delete post
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

PostDeleteConfirmDialog.Trigger = AlertDialog.Trigger;

export interface PostDeleteConfirmDialogProps extends AlertDialogRootProps {
  postQueue: PostQueueSchemaWithId;
  onDeleted?: () => void;
}
