import { cn } from '@zougui/react.ui';

export const ChapterSectionList = ({ className, ...rest }: ChapterSectionListProps) => {
  return (
    <div
      {...rest}
      className={cn('w-full flex gap-4 flex-wrap', className)}
    />
  );
}

export interface ChapterSectionListProps extends React.HTMLAttributes<HTMLDivElement> {

}
