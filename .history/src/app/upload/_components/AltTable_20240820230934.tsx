'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { DataTable, Dropdown, IconButton } from '@zougui/react.ui';
import { MoreHorizontal, Plus } from 'lucide-react';
import { AltFormDialog } from './AltFormDialog';
import { type SubmissionUploadSchema } from '~/schemas/upload';

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
  defaultValue,
  onNewAlt,
  onEditAlt,
}: {
  defaultValue: SubmissionUploadSchema['asEither'];
  onNewAlt: (data: Omit<SubmissionUploadSchema['asAlt'], 'createdAt'>) => void;
  onEditAlt: (data: Omit<SubmissionUploadSchema['asAlt'], 'createdAt'>) => void;
}) => [
  {
    accessorKey: 'alt.label',
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
          <AltFormDialog onSubmit={onNewAlt} defaultValue={defaultValue}>
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
            defaultValue={row.original}
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
] satisfies ColumnDef<Omit<SubmissionUploadSchema['asAlt'], 'createdAt'>>[];

export const AltTable = ({ alts, onAltsChange, defaultValue }: AltTableProps) => {
  const onNewAlt = (data: Omit<SubmissionUploadSchema['asAlt'], 'createdAt'>): void => {
    onAltsChange([...alts, data]);
  }

  const onEditAlt = (data: Omit<SubmissionUploadSchema['asAlt'], 'createdAt'>): void => {
    const updatedAlts = alts.map(alt => {
      return data.alt.id === alt.alt.id ? data : alt;
    });
    onAltsChange(updatedAlts);
  }

  return (
    <DataTable.Root
      columns={getColumns({
        defaultValue,
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
  alts: Omit<SubmissionUploadSchema['asAlt'], 'createdAt'>[];
  onAltsChange: (alts: Omit<SubmissionUploadSchema['asAlt'], 'createdAt'>[]) => void;
  defaultValue: SubmissionUploadSchema['asEither'];
}
