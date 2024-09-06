'use client';

import { AppLink, type InternalAppLinkProps } from '~/app/_components/atoms/AppLink';

export const PostSelectorLink = (props: PostSelectorLinkProps) => {
  return (
    <AppLink.Internal {...props} />
  );
}

export interface PostSelectorLinkProps extends Omit<InternalAppLinkProps, 'href'> {
  href: string;
}
