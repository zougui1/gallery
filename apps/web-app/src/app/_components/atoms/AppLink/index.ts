import { ExternalAppLink, type ExternalAppLinkProps } from './ExternalAppLink';
import { InternalAppLink, type InternalAppLinkProps } from './InternalAppLink';
import { linkStyles } from './styles';

export const AppLink = {
  styles: linkStyles,
  External: ExternalAppLink,
  Internal: InternalAppLink,
};

export type {
  ExternalAppLinkProps,
  InternalAppLinkProps,
};
