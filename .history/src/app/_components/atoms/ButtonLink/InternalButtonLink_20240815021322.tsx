import { Button } from '@zougui/react.ui';
import React from 'react';

import { AppLink, type InternalAppLinkProps } from '~/app/_components/atoms/AppLink';

export const InternalButtonLink = React.forwardRef<
  HTMLAnchorElement,
  InternalButtonLinkProps
>(({ disabled, href, children, ...rest }, ref) => {
  return (
    <AppLink.Internal {...rest} ref={ref} href={disabled ? '#' : href}>
      <Button disabled={disabled}>{children}</Button>
    </AppLink.Internal>
  );
});

InternalButtonLink.displayName = 'InternalButtonLink';

export interface InternalButtonLinkProps extends InternalAppLinkProps {
  disabled?: boolean;
}
