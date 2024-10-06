import { ExternalButtonLink, type ExternalButtonLinkProps } from './ExternalButtonLink';
import { InternalButtonLink, type InternalButtonLinkProps } from './InternalButtonLink';

export const ButtonLink = {
  External: ExternalButtonLink,
  Internal: InternalButtonLink,
};

export type {
  ExternalButtonLinkProps,
  InternalButtonLinkProps,
};
