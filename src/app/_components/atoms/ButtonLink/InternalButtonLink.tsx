import { Button, type ButtonProps } from '@zougui/react.ui';
import React from 'react';

import { AppLink, type InternalAppLinkProps } from '~/app/_components/atoms/AppLink';

export const InternalButtonLink = React.forwardRef<
  HTMLAnchorElement,
  InternalButtonLinkProps
>(({ disabled, href, children, size, ...rest }, ref) => {
  return (
    <AppLink.Internal {...rest} ref={ref} href={disabled ? '#' : href}>
      <Button disabled={disabled} size={size}>{children}</Button>
    </AppLink.Internal>
  );
});

InternalButtonLink.displayName = 'InternalButtonLink';

export interface InternalButtonLinkProps extends InternalAppLinkProps {
  disabled?: boolean;
  size?: ButtonProps['size'];
}
