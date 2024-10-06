'use client';

import { createContext, useContext, useMemo } from 'react';

import { type PostQueueSchemaWithId } from '~/server/database';

export interface ChapterSectionContextState {
  seriesId: string;
  title?: string;
  index: number;
  pages: PostQueueSchemaWithId[];
}

export const ChapterSectionContext = createContext<ChapterSectionContextState | undefined>(undefined);

export const ChapterSectionProvider = ({ seriesId, title, pages, index, children }: ChapterSectionProviderProps) => {

  const state = useMemo(() => {
    return {
      seriesId,
      title,
      pages,
      index,
    };
  }, [
    seriesId,
    title,
    pages,
    index,
  ]);

  return (
    <ChapterSectionContext.Provider value={state}>
      {children}
    </ChapterSectionContext.Provider>
  );
}

export interface ChapterSectionProviderProps extends ChapterSectionContextState {
  children?: React.ReactNode;
}

export const useChapterSection = (): ChapterSectionContextState => {
  const context = useContext(ChapterSectionContext);

  if (!context) {
    throw new Error('Cannot use post thumbnail outside of the ChapterSectionProvider tree');
  }

  return context;
}
