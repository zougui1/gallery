'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { DataTable, Dropdown, IconButton } from '@zougui/react.ui';
import { MoreHorizontal, Plus } from 'lucide-react';
import { PageFormDialog } from './PageFormDialog';
import { type AltData } from '../AltTable';

export interface PageData {
  url: string;
  title?: string;
  description?: string;
  attachmentUrl?: string;
  keywords?: string[];
  partIndex: number;
  alts: AltData[];
}

const getColumns = ({
  defaultValues,
  onNewPage,
}: {
  defaultValues: Partial<PageData>;
  onNewPage: (data: PageData) => void;
}) => [
  {
    accessorKey: 'partIndex',
    header: 'Page',
  },
  {
    accessorKey: 'keywords',
    header: 'Keywords',
    cell: ({ row }) => {
      const { keywords } = row.original;
      const limit = 3;

      if (!keywords || keywords.length <= limit) {
        return keywords;
      }

      const summary = keywords.slice(0, limit);
      const overflowingKeywords = keywords.slice(limit);

      return (
        <span title={keywords?.join(', ')}>
          {summary.join(', ')}... +{overflowingKeywords.length}
        </span>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    id: 'actions',
    header: () => {
      return (
        <div className="flex justify-end">
          <PageFormDialog
            onSubmit={onNewPage}
            defaultValues={defaultValues}
          >
            <PageFormDialog.Trigger asChild>
              <IconButton>
                <span>
                  <span className="sr-only">New</span>
                  <Plus className="h-4 w-4" />
                </span>
              </IconButton>
            </PageFormDialog.Trigger>
          </PageFormDialog>
        </div>
      );
    },

    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <PageFormDialog
            onSubmit={onNewPage}
            defaultValues={row.original}
          >
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
                <PageFormDialog.Trigger asChild>
                  <Dropdown.Item>Edit page</Dropdown.Item>
                </PageFormDialog.Trigger>
              </Dropdown.Content>
            </Dropdown.Root>
          </PageFormDialog>
        </div>
      );
    },
  },
] satisfies ColumnDef<PageData>[];

export const PageTable = ({ pages: series, onPagesChange, defaultValues }: PageTableProps) => {
  const onNewPage = (data: PageData): void => {
    onPagesChange([...series, data]);
  }

  return (
    <DataTable.Root
      columns={getColumns({
        defaultValues,
        onNewPage,
      })}
      data={series}
    >
      <DataTable.Content>
        <DataTable.Header />
        <DataTable.Body />
      </DataTable.Content>
    </DataTable.Root>
  );
}

export interface PageTableProps {
  pages: PageData[];
  onPagesChange: (series: PageData[]) => void;
  defaultValues: Partial<PageData & { keywords: string[] }>;
}
