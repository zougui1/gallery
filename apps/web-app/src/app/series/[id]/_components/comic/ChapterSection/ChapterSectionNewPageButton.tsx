'use client';

import { Plus } from 'lucide-react';

import { IconButton } from '@zougui/react.ui';

import { PageFormDialog, type PageFormDialogProps } from '~/app/upload/_components/comic-form/PageFormDialog';

import { useChapterSection } from './context';


export const ChapterSectionNewPageButton = ({ onNewPage }: ChapterSectionNewPageButtonProps) => {
  const { seriesId, pages } = useChapterSection();
  const lastPage = Math.max(...pages.map(p => p.series?.partIndex ?? 0));

  return (
    <div className="h-48 w-16 flex justify-center items-center">
      <PageFormDialog
        defaultValues={{
          series: {
            partIndex: lastPage + 1,
            id: seriesId,
          },
        }}
        onSubmit={onNewPage}
      >
        <PageFormDialog.Trigger asChild>
          <IconButton size="lg" className="w-6 h-6">
            <Plus className="w-6 h-6" />
          </IconButton>
        </PageFormDialog.Trigger>
      </PageFormDialog>
    </div>
  );
}

export interface ChapterSectionNewPageButtonProps {
  onNewPage: PageFormDialogProps['onSubmit'];
}
