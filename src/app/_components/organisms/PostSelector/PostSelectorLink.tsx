'use client';

import { type PostSchemaWithId } from '~/server/database';
import { AppLink, type InternalAppLinkProps } from '~/app/_components/atoms/AppLink';

import { usePostSelector } from './context';

export const PostSelectorLink = ({ href, ...rest }: PostSelectorLinkProps) => {
  const { posts } = usePostSelector();

  return (
    <AppLink.Internal
      {...rest}
      href={typeof href === 'function' ? href(posts) : href}
    />
  );
}

export interface PostSelectorLinkProps extends Omit<InternalAppLinkProps, 'href'> {
  href: string | ((posts: PostSchemaWithId[]) => string);
}
