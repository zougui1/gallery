'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { DataTable, IconButton } from '@zougui/react.ui';
import { Plus } from 'lucide-react';

export interface AltData {
  label: string;
  url: string;
  title?: string;
  description?: string;
  attachmentUrl?: string;
  keywords?: string[];
}

const getColumns = ({}) => [
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'url',
    header: 'URL',
  },
  {
    accessorKey: 'keywords',
    header: 'Keywords',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'attachmentUrl',
    header: 'Attachment URL',
  },
  {
    id: 'actions',
    header: () => {
      return (
        <div className="flex justify-end">
          <IconButton>
            <span className="sr-only">New</span>
            <Plus className="h-4 w-4" />
          </IconButton>
        </div>
      );
    },
  },
] satisfies ColumnDef<AltData>[];

export const AltTable = ({ alts }: AltTableProps) => {
  return (
    <DataTable.Root columns={getColumns({})} data={alts}>
      <DataTable.Content>
        <DataTable.Header />
        <DataTable.Body />
      </DataTable.Content>
    </DataTable.Root>
  );
}

export interface AltTableProps {
  alts: AltData[];
}
