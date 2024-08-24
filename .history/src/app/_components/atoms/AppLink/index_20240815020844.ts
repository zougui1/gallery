import { ExternalAppLink, type ExternalAppLinkProps } from './ExternalAppLink';
import { InternalAppLink, InternalAppLink2, type InternalAppLinkProps } from './InternalAppLink';
import { linkStyles } from './styles';

export const AppLink = {
  styles: linkStyles,
  External: ExternalAppLink,
  Internal: InternalAppLink,
  Internal2: InternalAppLink2,
};

export type {
  ExternalAppLinkProps,
  InternalAppLinkProps,
};
