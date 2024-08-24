'use client';

import React from 'react';
import Link from 'next/link';

import { linkStyles } from './styles';

export const InternalAppLink = (({ className, ...rest }, ref) => {
  return (
    <Link {...rest} ref={ref} className={linkStyles({ className })} />
  );
};

InternalAppLink.displayName = 'InternalAppLink';

InternalAppLink.TT = React.forwardRef<
  HTMLAnchorElement,
  InternalAppLinkProps
>(({ className, ...rest }, ref) => {
  return (
    <Link {...rest} ref={ref} className={linkStyles({ className })}>
      {React.cloneElement(rest.children, { onClick: () => console.log('test') })}
    </Link>
  );
});

InternalAppLink.TT.displayName = 'InternalAppLink.TT';

export interface InternalAppLinkProps extends Omit<React.ComponentProps<typeof Link>, 'ref'> {

}
