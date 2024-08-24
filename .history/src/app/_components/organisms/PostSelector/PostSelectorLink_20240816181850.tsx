'use client';

import Link from 'next/link';

import { type PostSchemaWithId } from '~/server/database';

import { usePostSelector } from './context';

export const PostSelectorLink = ({ href, ...rest }: PostSelectorLinkProps) => {
  const { posts } = usePostSelector();

  return (
    <Link
      {...rest}
      href={typeof href === 'function' ? href(posts) : href}
    />
  );
}

export interface PostSelectorLinkProps extends Omit<React.ComponentProps<typeof Link>, 'href'> {
  href: string | ((posts: PostSchemaWithId[]) => string);
}
