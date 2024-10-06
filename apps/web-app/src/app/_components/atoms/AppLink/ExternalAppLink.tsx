'use client';

import React from 'react';

import { linkStyles } from './styles';

export const ExternalAppLink = React.forwardRef<
  HTMLAnchorElement,
  ExternalAppLinkProps
>(({ className, ...rest }, ref) => {
  return (
    <a
      target="_blank"
      rel="noreferrer noopener nofollow"
      {...rest}
      ref={ref}
      className={linkStyles({ className })}
    />
  );
});

ExternalAppLink.displayName = 'ExternalAppLink';

export interface ExternalAppLinkProps extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {

}
