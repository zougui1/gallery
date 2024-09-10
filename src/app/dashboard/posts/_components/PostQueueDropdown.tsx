import { Dropdown } from '@zougui/react.ui';

import { copyToClipboard } from '~/app/_utils';
import { api } from '~/trpc/react';
import { type PostQueueSchemaWithId } from '~/server/database';

import { PostDialog } from './PostDialog';

export const PostQueueDropdown = ({ post, children }: PostQueueDropdownProps) => {
  const restartMutation = api.postQueue.restart.useMutation();

  const restartProcess = () => {
    restartMutation.mutate({ id: post._id });
  }

  return (
    <PostDialog post={post}>
      <Dropdown.Root>
        <Dropdown.Trigger asChild>{children}</Dropdown.Trigger>

        <Dropdown.Content>
          <Dropdown.Item
            onClick={() => copyToClipboard(post._id)}
          >
            Copy ID
          </Dropdown.Item>

          <PostDialog.Trigger asChild>
            <Dropdown.Item>View details</Dropdown.Item>
          </PostDialog.Trigger>

          <Dropdown.Item onClick={restartProcess}>
            Restart process
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </PostDialog>
  );
}

export interface PostQueueDropdownProps {
  post: PostQueueSchemaWithId;
  children?: React.ReactNode;
}
