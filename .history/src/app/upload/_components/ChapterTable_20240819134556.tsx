'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { DataTable, IconButton } from '@zougui/react.ui';
import { Plus } from 'lucide-react';
import { ChapterFormDialog } from './ChapterFormDialog';
import { type PageData, PageTable } from './PageTable';

export interface ChapterData {
  title?: string;
  chapterIndex: number;
  pages: PageData[];
}

const getColumns = ({
  defaultValues,
  onNewChapter,
}: {
  defaultValues: Partial<ChapterData>;
  onNewChapter: (data: ChapterData) => void;
}) => [
  {
    accessorKey: 'chapterIndex',
    header: 'Chapter',
  },
  {
    accessorKey: 'pages',
    header: 'Pages',
    cell: ({ row }) => {
      const { pages } = row.original;
      return `${pages.length} page${pages.length === 1 ? '' : 's'}`
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
          <ChapterFormDialog
            onSubmit={onNewChapter}
            defaultValues={defaultValues}
          >
            <IconButton>
              <span>
                <span className="sr-only">New</span>
                <Plus className="h-4 w-4" />
              </span>
            </IconButton>
          </ChapterFormDialog>
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
] satisfies ColumnDef<ChapterData>[];

export const ChapterTable = ({ chapters: series, onChaptersChange, defaultValues }: ChapterTableProps) => {
  const onNewChapter = (data: ChapterData): void => {
    onChaptersChange([...series, data]);
  }

  return (
    <DataTable.Root
      columns={getColumns({
        defaultValues,
        onNewChapter,
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

export interface ChapterTableProps {
  chapters: ChapterData[];
  onChaptersChange: (series: ChapterData[]) => void;
  defaultValues: Partial<ChapterData & { keywords: string[] }>;
}
