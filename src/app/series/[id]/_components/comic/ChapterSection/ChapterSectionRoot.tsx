import { cn } from '@zougui/react.ui';

import { ChapterSectionProvider, type ChapterSectionProviderProps } from './context';

export const ChapterSectionRoot = ({ className, index, pages, seriesId, title, ...rest }: ChapterSectionRootProps) => {
  return (
    <ChapterSectionProvider
      index={index}
      pages={pages}
      seriesId={seriesId}
      title={title}
    >
      <section
        {...rest}
        className={cn('w-full', className)}
      />
    </ChapterSectionProvider>
  );
}

export interface ChapterSectionRootProps extends React.HTMLAttributes<HTMLElement>, ChapterSectionProviderProps {

}
