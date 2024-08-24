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

interface InternalAltData extends AltData {
  uncommonKeywords?: string[];
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
    cell: ({ row }) => {
      const { uncommonKeywords, keywords } = row.original;
      const limit = 5;

      if (!uncommonKeywords || uncommonKeywords.length <= limit) {
        return uncommonKeywords;
      }

      const summary = uncommonKeywords.slice(0, limit);
      const overflowingKeywords = uncommonKeywords.slice(limit);

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
          <IconButton>
            <span>
              <span className="sr-only">New</span>
              <Plus className="h-4 w-4" />
            </span>
          </IconButton>
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
] satisfies ColumnDef<InternalAltData>[];

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
