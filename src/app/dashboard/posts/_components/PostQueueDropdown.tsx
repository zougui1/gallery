import { useState } from 'react';

import { Dropdown } from '@zougui/react.ui';

import { copyToClipboard } from '~/app/_utils';
import { api } from '~/trpc/react';
import { type PostQueueSchemaWithId } from '~/server/database';
import { PostQueueStatus, deletableStatuses, permanentlyDeletableStatuses } from '~/enums';

import { PostDialog } from './PostDialog';
import { PostQueuePermanentDeleteConfirmDialog } from './PostQueuePermanentDeleteConfirmDialog';
import { PostDeleteConfirmDialog } from './PostDeleteConfirmDialog';

export const PostQueueDropdown = ({ post, children }: PostQueueDropdownProps) => {
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [openPermanentlyDeleteConfirmDialog, setOpenPermanentlyDeleteConfirmDialog] = useState(false);

  const restartMutation = api.postQueue.restart.useMutation();
  const lastStatus = post.steps[post.steps.length - 1]?.status ?? PostQueueStatus.idle;

  const restartProcess = () => {
    restartMutation.mutate({ id: post._id });
  }

  return (
    <>
      <PostDialog
        post={post}
        open={openPostDialog}
        onOpenChange={setOpenPostDialog}
      />
      <PostDeleteConfirmDialog
        postQueue={post}
        open={openDeleteConfirmDialog}
        onOpenChange={setOpenDeleteConfirmDialog}
      />
      <PostQueuePermanentDeleteConfirmDialog
        postQueue={post}
        open={openPermanentlyDeleteConfirmDialog}
        onOpenChange={setOpenPermanentlyDeleteConfirmDialog}
      />

      <Dropdown.Root>
        <Dropdown.Trigger asChild>{children}</Dropdown.Trigger>

        <Dropdown.Content>
          <Dropdown.Item
            onClick={() => copyToClipboard(post._id)}
          >
            Copy ID
          </Dropdown.Item>

          <Dropdown.Item onClick={() => setOpenPostDialog(true)}>View details</Dropdown.Item>

          <Dropdown.Item onClick={restartProcess}>
            Restart process
          </Dropdown.Item>

          {deletableStatuses.includes(lastStatus) && (
            <>
              <Dropdown.Separator />
              <Dropdown.Item
                onClick={() => setOpenDeleteConfirmDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                Delete post
              </Dropdown.Item>
            </>
          )}

          {permanentlyDeletableStatuses.includes(lastStatus) && (
            <>
              <Dropdown.Separator />
              <Dropdown.Item
                onClick={() => setOpenPermanentlyDeleteConfirmDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                Delete permanently
              </Dropdown.Item>
            </>
          )}
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
}

export interface PostQueueDropdownProps {
  post: PostQueueSchemaWithId;
  children?: React.ReactNode;
}
