'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { DateTime } from 'luxon';

import { Button, DataTable, Dialog } from '@zougui/react.ui';

import { type PostQueueSchemaWithId, type PostQueueStepSchema } from '~/server/database';
import { formatDate } from '~/app/_utils';

import { Status } from './Status';
import { api } from '~/trpc/react';

const columns: ColumnDef<PostQueueStepSchema>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <Status status={row.original.status} />,
  },
  {
    accessorKey: 'message',
    header: 'Message',
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      return formatDate(row.original.date, DateTime.DATETIME_SHORT);
    },
  },
];

export const PostDialog = ({ post, children }: PostDialogProps) => {
  const restartMutation = api.postQueue.restart.useMutation();

  const restartProcess = () => {
    restartMutation.mutate({ id: post._id });
  }

  return (
    <Dialog.Root>
      {children}

      <Dialog.Content className="max-w-5xl">
        <Dialog.Header>
          <Dialog.Title>Post</Dialog.Title>
          <Dialog.Description>Details for the post {post.url}</Dialog.Description>
        </Dialog.Header>

        <Dialog.Body className="!max-h-[min(calc(100vh-190px),_56rem)]">
          <DataTable.Root
            data={post.steps}
            columns={columns}
            pageSize={50}
          >
            <DataTable.Content>
              <DataTable.Header />
              <DataTable.Body />
            </DataTable.Content>

            <DataTable.ClientPagination />
          </DataTable.Root>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button>Close</Button>
          </Dialog.Close>

          <Button onClick={restartProcess}>Restart process</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

PostDialog.Trigger = Dialog.Trigger;

export interface PostDialogProps {
  post: PostQueueSchemaWithId;
  children?: React.ReactNode;
}
