import React from 'react';
import Link from 'next/link';
import { Slot } from '@radix-ui/react-slot';

import { Button } from '@zougui/react.ui';

import { linkStyles, type LinkVariants } from './styles';

export const InternalAppLink = React.forwardRef<
  HTMLAnchorElement,
  InternalAppLinkProps
>(({ className, variant, ...rest }, ref) => {
  const isButton = variant === 'button';
  const Comp = isButton ? Button : Slot;

  return (
    <Comp asChild={isButton}>
      <Link {...rest} ref={ref} className={linkStyles({ className, variant })} />
    </Comp>
  );
});

InternalAppLink.displayName = 'InternalAppLink';

export interface InternalAppLinkProps extends Omit<React.ComponentProps<typeof Link>, 'ref'>, LinkVariants {

}
