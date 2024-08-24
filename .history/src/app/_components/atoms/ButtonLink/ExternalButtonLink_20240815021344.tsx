import { Button } from '@zougui/react.ui';
import React from 'react';

import { AppLink, type ExternalAppLinkProps } from '~/app/_components/atoms/AppLink';

export const ExternalButtonLink = React.forwardRef<
  HTMLAnchorElement,
  ExternalButtonLinkProps
>(({ disabled, href, children, ...rest }, ref) => {
  return (
    <AppLink.External {...rest} ref={ref} href={disabled ? '#' : href}>
      <Button disabled={disabled}>{children}</Button>
    </AppLink.External>
  );
});

ExternalButtonLink.displayName = 'ExternalButtonLink';

export interface ExternalButtonLinkProps extends ExternalAppLinkProps {
  disabled?: boolean;
}
