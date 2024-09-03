import { Button, type ButtonProps, Slot } from '@zougui/react.ui';
import React from 'react';

import { AppLink, type InternalAppLinkProps } from '~/app/_components/atoms/AppLink';

export const InternalButtonLink = React.forwardRef<
  HTMLAnchorElement,
  InternalButtonLinkProps
>(({ disabled, href, children, size, asChild, ...rest }, ref) => {
  const ButtonComponent = asChild ? Slot : Button;

  return (
    <AppLink.Internal {...rest} ref={ref} href={disabled ? '#' : href}>
      <ButtonComponent disabled={disabled} size={size}>{children}</ButtonComponent>
    </AppLink.Internal>
  );
});

InternalButtonLink.displayName = 'InternalButtonLink';

export interface InternalButtonLinkProps extends InternalAppLinkProps {
  disabled?: boolean;
  size?: ButtonProps['size'];
  asChild?: boolean;
}
