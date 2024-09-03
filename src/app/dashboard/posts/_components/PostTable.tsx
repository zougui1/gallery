'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';
import { DateTime } from 'luxon';
import { useQueryState } from 'nuqs';
import { z } from 'zod';

import { DataTable, Dropdown, IconButton } from '@zougui/react.ui';

import { AppLink } from '~/app/_components/atoms/AppLink';
import { copyToClipboard, renderKeywordsColumn } from '~/app/_utils';
import { type PostQueueSchemaWithId } from '~/server/database';
import { api } from '~/trpc/react';
import { PostQueueStatus, postQueueStatusLabelMap } from '~/enums';

import { usePostsFilters } from '../_hooks';

const columns: ColumnDef<PostQueueSchemaWithId>[] = [
  {
    accessorKey: 'url',
    header: 'Source',
    cell: ({ row }) => {
      return (
        <AppLink.External href={row.original.url}>
          {row.original.url}
        </AppLink.External>
      );
    },
  },
  {
    accessorKey: 'keywords',
    header: 'Keywords',
    cell: ({ row }) => {
      const { keywords } = row.original;

      return (
        <span title={keywords?.join(', ')}>
          {renderKeywordsColumn(keywords)}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      return (
        DateTime.fromJSDate(row.original.createdAt).toLocaleString(DateTime.DATETIME_SHORT)
      );
    },
  },
  {
    accessorKey: 'steps',
    header: 'Status',
    cell: ({ row }) => {
      const lastStep = row.original.steps[row.original.steps.length - 1];
      const status = lastStep?.status ?? PostQueueStatus.idle;

      const colors: Partial<Record<typeof status, string>> = {
        complete: 'text-green-500',
        error: 'text-red-500',
      };

      return (
        <span className={colors[status]}>
          {postQueueStatusLabelMap[status]}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: () => {
      return (
        <div className="flex justify-end">
          <IconButton>
            <span>
              <span className="sr-only">New</span>
              <Plus className="h-4 w-4" />
            </span>
          </IconButton>
        </div>
      );
    },

    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <IconButton>
                <span>
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              </IconButton>
            </Dropdown.Trigger>

            <Dropdown.Content>
              <Dropdown.Item
                onClick={() => copyToClipboard(row.original._id)}
              >
                Copy ID
              </Dropdown.Item>
              <Dropdown.Item>View details</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
      );
    },
  },
];

export const PostTable = () => {
  const [page, setPage] = useQueryState('page', {
    parse: (query: string) => z.coerce.number().min(1).default(1).parse(query),
    serialize: String,
    defaultValue: 1,
  });
  const [filters] = usePostsFilters();

  const [{ posts, lastPage }] = api.postQueue.search.useSuspenseQuery({ ...filters, page });

  return (
    <DataTable.Root
      columns={columns}
      data={posts}
    >
      <DataTable.Content>
        <DataTable.Header />
        <DataTable.Body />
      </DataTable.Content>

      <DataTable.Pagination.Root>
        <DataTable.Pagination.Content>
          <span>Page {page} of {lastPage}</span>

          <DataTable.Pagination.Button
            disabled={page <= 1}
            onClick={() => setPage(prevPage => prevPage - 1)}
          >
            Previous
          </DataTable.Pagination.Button>

          <DataTable.Pagination.Button
            disabled={page >= lastPage}
            onClick={() => setPage(prevPage => prevPage + 1)}
          >
            Next
          </DataTable.Pagination.Button>
        </DataTable.Pagination.Content>
      </DataTable.Pagination.Root>
    </DataTable.Root>
  );
}
