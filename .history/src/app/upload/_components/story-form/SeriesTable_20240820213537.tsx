'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { DataTable, Dropdown, IconButton } from '@zougui/react.ui';
import { MoreHorizontal, Plus } from 'lucide-react';
import { SeriesFormDialog } from './SeriesFormDialog';

export interface SeriesData {
  _id: string;
  url: string;
  title?: string;
  description?: string;
  attachmentUrl?: string;
  keywords?: string[];
  chapterIndex: number;
  partIndex: number;
}

const getColumns = ({
  defaultValues,
  onNewSeries,
  onEditSeries,
}: {
  defaultValues: Partial<SeriesData>;
  onNewSeries: (data: SeriesData) => void;
  onEditSeries: (data: SeriesData) => void;
}) => [
  {
    accessorKey: 'chapterIndex',
    header: 'Chapter',
  },
  {
    accessorKey: 'partIndex',
    header: 'Part',
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
          <SeriesFormDialog
            onSubmit={onNewSeries}
            defaultValues={defaultValues}
          >
            <SeriesFormDialog.Trigger asChild>
              <IconButton>
                <span>
                  <span className="sr-only">New</span>
                  <Plus className="h-4 w-4" />
                </span>
              </IconButton>
            </SeriesFormDialog.Trigger>
          </SeriesFormDialog>
        </div>
      );
    },

    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <SeriesFormDialog
            onSubmit={onNewSeries}
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
                <SeriesFormDialog.Trigger asChild>
                  <Dropdown.Item>Edit chapter</Dropdown.Item>
                </SeriesFormDialog.Trigger>
              </Dropdown.Content>
            </Dropdown.Root>
          </SeriesFormDialog>
        </div>
      );
    },
  },
] satisfies ColumnDef<SeriesData>[];

export const SeriesTable = ({ series, onSeriesChange, defaultValues }: SeriesTableProps) => {
  const onNewSeries = (data: SeriesData): void => {
    onSeriesChange([...series, data]);
  }

  const onEditSeries = (data: SeriesData): void => {
    onSeriesChange([...series, data]);
  }

  return (
    <DataTable.Root
      columns={getColumns({
        defaultValues,
        onNewSeries,
        onEditSeries,
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

export interface SeriesTableProps {
  series: SeriesData[];
  onSeriesChange: (series: SeriesData[]) => void;
  defaultValues: Partial<SeriesData>;
}
