'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';
import { type PartialDeep } from 'type-fest';

import { DataTable, Dropdown, IconButton } from '@zougui/react.ui';

import { type PostSeriesType } from '~/enums';
import { renderKeywordsColumn } from '~/app/_utils';

import { SeriesFormDialog } from './SeriesFormDialog';

export interface SeriesData {
  url: string;
  title?: string;
  description?: string;
  attachmentUrl?: string;
  keywords: string[];
  series: {
    id: string;
    type: PostSeriesType;
    chapterName?: string;
    chapterIndex: number;
    partIndex: number;
  };
}

const getColumns = ({
  defaultValues,
  onNewChapter,
  onEditChapter,
}: {
  defaultValues?: PartialDeep<SeriesData>;
  onNewChapter: (data: SeriesData) => void;
  onEditChapter: (data: SeriesData) => void;
}) => [
  {
    id: 'chapterIndex',
    accessorFn: data => data.series?.chapterIndex,
    header: 'Chapter',
  },
  {
    id: 'partIndex',
    accessorFn: data => data.series?.partIndex,
    header: 'Part',
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
          <SeriesFormDialog
            onSubmit={onNewChapter}
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
            onSubmit={onEditChapter}
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
  const onNewChapter = (data: SeriesData): void => {
    onSeriesChange([...series, data]);
  }

  const onEditChapter = (data: SeriesData): void => {
    const updatedChapters = series.map(chapter => {
      return data.series.id === chapter.series.id ? data : chapter;
    });
    onSeriesChange(updatedChapters);
  }

  return (
    <DataTable.Root
      columns={getColumns({
        defaultValues,
        onNewChapter,
        onEditChapter,
      })}
      data={series}
    >
      <DataTable.Content>
        <DataTable.Header />
        <DataTable.Body />
      </DataTable.Content>

      <DataTable.ClientPagination />
    </DataTable.Root>
  );
}

export interface SeriesTableProps {
  series: SeriesData[];
  onSeriesChange: (series: SeriesData[]) => void;
  defaultValues?: PartialDeep<SeriesData>;
}
