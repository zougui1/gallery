'use client';

import { Button, type ButtonProps, Slot } from '@zougui/react.ui';

import { type PostSchemaWithId } from '~/server/database';

import { usePostSelector } from './context';

export const PostSelectorTrigger = ({ post, asChild, onClick, ...rest }: PostSelectorTriggerProps) => {
  const Comp = asChild ? Slot : Button;
  const { selectPost, selectAltId, selectSeriesId, getSelectionType } = usePostSelector();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      const selectionType = getSelectionType(post);

      if (!selectionType) {
        selectPost(post);
        return;
      }

      const handlers: Record<typeof selectionType, () => void> = {
        post: () => {
          selectPost(post);

          if (post.series) {
            selectSeriesId(post.series.id);
          } else if (post.alt) {
            selectAltId(post.alt.id);
          }
        },
        alt: () => {
          if (post.alt) {
            selectAltId(post.alt.id);
          }
        },
        series: () => {
          if (post.series) {
            selectSeriesId(post.series.id);
          }
        },
      };

      handlers[selectionType]();
    }
  }

  return (
    <Comp
      {...rest}
      onClick={handleClick}
    />
  );
}

export interface PostSelectorTriggerProps extends ButtonProps {
  post: PostSchemaWithId;
  asChild?: boolean;
}
