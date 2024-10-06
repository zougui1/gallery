import { Button, type ButtonProps, Slot } from '@zougui/react.ui';
import React from 'react';

import { AppLink, type ExternalAppLinkProps } from '~/app/_components/atoms/AppLink';

export const ExternalButtonLink = React.forwardRef<
  HTMLAnchorElement,
  ExternalButtonLinkProps
>(({ disabled, href, children, size, asChild, ...rest }, ref) => {
  const ButtonComponent = asChild ? Slot : Button;

  return (
    <AppLink.External {...rest} ref={ref} href={disabled ? '#' : href}>
      <ButtonComponent disabled={disabled} size={size}>{children}</ButtonComponent>
    </AppLink.External>
  );
});

ExternalButtonLink.displayName = 'ExternalButtonLink';

export interface ExternalButtonLinkProps extends ExternalAppLinkProps {
  disabled?: boolean;
  size?: ButtonProps['size'];
  asChild?: boolean;
}
