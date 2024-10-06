'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type PartialDeep } from 'type-fest';

import { DataTable, Dropdown, IconButton } from '@zougui/react.ui';
import { MoreHorizontal, Plus } from 'lucide-react';
import { ChapterFormDialog } from './ChapterFormDialog';
import { type PageData } from './PageTable';

export interface ChapterData {
  _id: string;
  title?: string;
  chapterIndex: number;
  pages: PageData[];
}

const getColumns = ({
  defaultValues,
  onNewChapter,
  onEditChapter,
}: {
  defaultValues: PartialDeep<ChapterData>;
  onNewChapter: (data: ChapterData) => void;
  onEditChapter: (data: ChapterData) => void;
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
            <ChapterFormDialog.Trigger asChild>
              <IconButton>
                <span>
                  <span className="sr-only">New</span>
                  <Plus className="h-4 w-4" />
                </span>
              </IconButton>
            </ChapterFormDialog.Trigger>
          </ChapterFormDialog>
        </div>
      );
    },

    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <ChapterFormDialog
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
                <ChapterFormDialog.Trigger asChild>
                  <Dropdown.Item>Edit chapter</Dropdown.Item>
                </ChapterFormDialog.Trigger>
              </Dropdown.Content>
            </Dropdown.Root>
          </ChapterFormDialog>
        </div>
      );
    },
  },
] satisfies ColumnDef<ChapterData>[];

export const ChapterTable = ({ chapters, onChaptersChange, defaultValues }: ChapterTableProps) => {
  const onNewChapter = (data: ChapterData): void => {
    onChaptersChange([...chapters, data]);
  }

  const onEditChapter = (data: ChapterData): void => {
    const updatedChapters = chapters.map(chapter => {
      return data._id === chapter._id ? data : chapter;
    });
    onChaptersChange(updatedChapters);
  }

  return (
    <DataTable.Root
      columns={getColumns({
        defaultValues,
        onNewChapter,
        onEditChapter,
      })}
      data={chapters}
    >
      <DataTable.Content>
        <DataTable.Header />
        <DataTable.Body />
      </DataTable.Content>

      <DataTable.ClientPagination />
    </DataTable.Root>
  );
}

export interface ChapterTableProps {
  chapters: ChapterData[];
  onChaptersChange: (series: ChapterData[]) => void;
  defaultValues: PartialDeep<ChapterData & { keywords: string[] }>;
}
