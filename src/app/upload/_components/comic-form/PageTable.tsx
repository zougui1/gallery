'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';
import { type PartialDeep } from 'type-fest';

import { DataTable, Dropdown, IconButton } from '@zougui/react.ui';

import { type SubmissionUploadSchema } from '~/schemas/upload';
import { renderKeywordsColumn } from '~/app/_utils';

import { PageFormDialog } from './PageFormDialog';

export interface PageData {
  url: string;
  title: string;
  description?: string;
  attachmentUrl?: string;
  keywords: string[];
  series: {
    id: string;
    partIndex: number;
  };
  alt?: {
    id: string;
    label: string;
  };
  alts: Omit<SubmissionUploadSchema['asAlt'], 'createdAt'>[];
}

const getColumns = ({
  defaultValues,
  onNewPage,
  onEditPage,
}: {
  defaultValues: PartialDeep<PageData>;
  onNewPage: (data: PageData) => void;
  onEditPage: (data: PageData) => void;
}) => [
  {
    id: 'partIndex',
    accessorFn: data => data.series.partIndex,
    header: 'Page',
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
            onSubmit={onEditPage}
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

export const PageTable = ({ pages, onPagesChange, defaultValues }: PageTableProps) => {
  const onNewPage = (data: PageData): void => {
    onPagesChange([...pages, data]);
  }

  const onEditPage = (data: PageData): void => {
    const updatedPages = pages.map(page => {
      return data.series.id === page.series.id ? data : page;
    });
    onPagesChange(updatedPages);
  }

  return (
    <DataTable.Root
      columns={getColumns({
        defaultValues,
        onNewPage,
        onEditPage,
      })}
      data={pages}
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
  defaultValues: PartialDeep<PageData & { keywords: string[] }>;
}
