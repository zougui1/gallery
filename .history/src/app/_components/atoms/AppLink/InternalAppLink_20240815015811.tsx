'use client';

import React from 'react';
import Link from 'next/link';
import { Slot } from '@radix-ui/react-slot';

import { Button } from '@zougui/react.ui';

import { linkStyles, type LinkVariants } from './styles';

export const InternalAppLink = React.forwardRef<
  HTMLAnchorElement,
  InternalAppLinkProps
>(({ className, variant, disabled, ...rest }, ref) => {
  const isButton = variant === 'button';
  const Comp = isButton ? Button : Slot;

  return (
    <Comp asChild={isButton}>
      <Link
        {...rest}
        ref={ref}
        onClick={e => e.preventDefault()}
        className={linkStyles({ className, variant, disabled })}
      />
    </Comp>
  );
});

InternalAppLink.displayName = 'InternalAppLink';

export interface InternalAppLinkProps extends Omit<React.ComponentProps<typeof Link>, 'ref'>, LinkVariants {

}
