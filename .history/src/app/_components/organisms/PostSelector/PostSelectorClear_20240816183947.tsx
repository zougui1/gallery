'use client';

import { Button, type ButtonProps, Slot } from '@zougui/react.ui';

import { type PostSchemaWithId } from '~/server/database';

import { usePostSelector } from './context';

export const PostSelectorTrigger = ({ post, asChild, onClick, ...rest }: PostSelectorTriggerProps) => {
  const Comp = asChild ? Slot : Button;
  const { selectPost } = usePostSelector();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      selectPost(post);
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
