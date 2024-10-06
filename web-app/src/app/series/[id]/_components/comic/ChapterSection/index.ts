import { ChapterSectionRoot, type ChapterSectionRootProps } from './ChapterSectionRoot';
import { ChapterSectionTitle, type ChapterSectionTitleProps } from './ChapterSectionTitle';
import { ChapterSectionList, type ChapterSectionListProps } from './ChapterSectionList';
import { ChapterSectionItem, type ChapterSectionItemProps } from './ChapterSectionItem';
import { ChapterSectionNewPageButton } from './ChapterSectionNewPageButton';

export const ChapterSection = {
  Root: ChapterSectionRoot,
  Title: ChapterSectionTitle,
  List: ChapterSectionList,
  Item: ChapterSectionItem,
  NewPageButton: ChapterSectionNewPageButton,
};

export type {
  ChapterSectionRootProps,
  ChapterSectionTitleProps,
  ChapterSectionListProps,
  ChapterSectionItemProps,
};
