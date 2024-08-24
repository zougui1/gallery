import { Button, type ButtonProps } from '@zougui/react.ui';
import React from 'react';

import { AppLink, type ExternalAppLinkProps } from '~/app/_components/atoms/AppLink';

export const ExternalButtonLink = React.forwardRef<
  HTMLAnchorElement,
  ExternalButtonLinkProps
>(({ disabled, href, children, size, ...rest }, ref) => {
  return (
    <AppLink.External {...rest} ref={ref} href={disabled ? '#' : href}>
      <Button disabled={disabled} size={size}>{children}</Button>
    </AppLink.External>
  );
});

ExternalButtonLink.displayName = 'ExternalButtonLink';

export interface ExternalButtonLinkProps extends ExternalAppLinkProps {
  disabled?: boolean;
  size?: ButtonProps['size'];
}
