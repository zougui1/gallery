'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { DataTable, IconButton } from '@zougui/react.ui';
import { Plus } from 'lucide-react';
import { PageFormDialog } from './PageFormDialog';

export interface PageData {
  title?: string;
  partIndex: number;
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
            <IconButton>
              <span>
                <span className="sr-only">New</span>
                <Plus className="h-4 w-4" />
              </span>
            </IconButton>
          </PageFormDialog>
        </div>
      );
    },

    cell: () => {
      return (
        <div className="flex justify-end">

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
