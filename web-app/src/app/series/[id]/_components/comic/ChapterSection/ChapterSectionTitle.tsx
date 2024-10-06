'use client';

import { Typography, type TypographyProps } from '@zougui/react.ui';

import { useChapterSection } from './context';

export const ChapterSectionTitle = (props: ChapterSectionTitleProps) => {
  const { index, title } = useChapterSection();

  return (
    <Typography.H5 {...props}>
      Chapter {index}
      {title && ` - ${title}`}
    </Typography.H5>
  );
}

export interface ChapterSectionTitleProps extends Omit<TypographyProps<'h5'>, 'children'> {

}
