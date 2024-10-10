import { FurAffinityClient } from '@zougui/furaffinity';

export enum UrlSource {
  furaffinity = 'furaffinity',
  e621 = 'e621',
  unknown = 'unknown',
}

export const getUrlSource = (url: string): UrlSource => {
  if (FurAffinityClient.URL.checkIsValidHostName(url)) {
    return UrlSource.furaffinity;
  }

  return UrlSource.unknown;
}
