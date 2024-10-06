'use client';

import React from 'react';
import Link from 'next/link';

import { linkStyles } from './styles';

export const InternalAppLink = React.forwardRef<
  HTMLAnchorElement,
  InternalAppLinkProps
>(({ className, ...rest }, ref) => {
  return (
    <Link {...rest} ref={ref} className={linkStyles({ className })} />
  );
});

InternalAppLink.displayName = 'InternalAppLink';

export interface InternalAppLinkProps extends Omit<React.ComponentProps<typeof Link>, 'ref'> {

}
