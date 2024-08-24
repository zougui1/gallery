'use client';

import { Button, type ButtonProps, Slot } from '@zougui/react.ui';

import { usePostSelector } from './context';

export const PostSelectorClear = ({ asChild, onClick, children, ...rest }: PostSelectorClearProps) => {
  const Comp = asChild ? Slot : Button;
  const { clearPosts } = usePostSelector();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      clearPosts();
    }
  }

  return (
    <Comp
      {...rest}
      onClick={handleClick}
    >
      {children ?? 'Clear posts'}
    </Comp>
  );
}

export interface PostSelectorClearProps extends ButtonProps {
  asChild?: boolean;
}
