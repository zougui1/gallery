import { FurAffinityClient } from '@zougui/furaffinity';

import { removeTrailing } from './removeTrailing';

const normalizedHostNames = {
  furaffinity: 'www.furaffinity.net',
};

export const normalizeUrl = (url: string): string => {
  if (FurAffinityClient.URL.checkIsValidHostName(url)) {
    return removeTrailing(FurAffinityClient.URL.normalizeHostName(url, normalizedHostNames.furaffinity), '/');
  }

  return removeTrailing(url, '/');
}
