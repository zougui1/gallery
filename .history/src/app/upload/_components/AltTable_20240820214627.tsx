'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { DataTable, Dropdown, IconButton } from '@zougui/react.ui';
import { AlignVerticalSpaceAround, MoreHorizontal, Plus } from 'lucide-react';
import { AltFormDialog } from './AltFormDialog';

export interface AltData {
  _id: string;
  label: string;
  url: string;
  title?: string;
  description?: string;
  attachmentUrl?: string;
  keywords?: string[];
}

const getColumns = ({
  originalData,
  onNewAlt,
  onEditAlt,
}: {
  originalData: AltData;
  onNewAlt: (data: AltData) => void;
  onEditAlt: (data: AltData) => void;
}) => [
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
          <AltFormDialog onSubmit={onNewAlt} originalData={originalData}>
            <AltFormDialog.Trigger asChild>
              <IconButton>
                <span>
                  <span className="sr-only">New</span>
                  <Plus className="h-4 w-4" />
                </span>
              </IconButton>
            </AltFormDialog.Trigger>
          </AltFormDialog>
        </div>
      );
    },

    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <AltFormDialog
            onSubmit={onEditAlt}
            originalData={row.original}
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
                <AltFormDialog.Trigger asChild>
                  <Dropdown.Item>Edit alt</Dropdown.Item>
                </AltFormDialog.Trigger>
              </Dropdown.Content>
            </Dropdown.Root>
          </AltFormDialog>
        </div>
      );
    },
  },
] satisfies ColumnDef<AltData>[];

export const AltTable = ({ alts, onAltsChange, originalData }: AltTableProps) => {
  const onNewAlt = (data: AltData): void => {
    onAltsChange([...alts, data]);
  }

  const onEditAlt = (data: AltData): void => {
    const updatedAlts = alts.map(alt => {
      return data._id === alt._id ? data : alt;
    });
    onAltsChange(updatedAlts);
  }

  return (
    <DataTable.Root
      columns={getColumns({
        originalData,
        onNewAlt,
        onEditAlt,
      })}
      data={alts}
    >
      <DataTable.Content>
        <DataTable.Header />
        <DataTable.Body />
      </DataTable.Content>
    </DataTable.Root>
  );
}

export interface AltTableProps {
  alts: AltData[];
  onAltsChange: (alts: AltData[]) => void;
  originalData: AltData;
}
