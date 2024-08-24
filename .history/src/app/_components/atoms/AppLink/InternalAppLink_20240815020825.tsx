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

export const InternalAppLink2 = React.forwardRef<
  HTMLAnchorElement,
  InternalAppLinkProps
>(({ className, ...rest }, ref) => {
  return (
    <Link {...rest} ref={ref} className={linkStyles({ className })}>
      {React.cloneElement(rest.children, { onClick: () => console.log('test') })}
    </Link>
  );
});

InternalAppLink2.displayName = 'InternalAppLink2';

export interface InternalAppLinkProps extends Omit<React.ComponentProps<typeof Link>, 'ref'> {

}
