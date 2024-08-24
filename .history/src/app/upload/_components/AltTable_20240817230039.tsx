'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@zougui/react.ui';

export interface AltData {
  label: string;
  url: string;
  title?: string;
  description?: string;
  attachmentUrl?: string;
  keywords?: string[];
}

const columns = [
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
] satisfies ColumnDef<AltData>[];

export const AltTable = ({ alts }: AltTableProps) => {
  return (
    <DataTable.Root columns={columns} data={alts}>
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
