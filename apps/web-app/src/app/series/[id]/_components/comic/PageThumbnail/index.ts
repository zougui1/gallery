import {
  PostThumbnail,
  type PostThumbnailRootProps,
  type PostThumbnailImageProps,
  type PostThumbnailLinkProps,
} from '~/app/_components/organisms/PostThumbnail';

import { PageThumbnailCaption, type PageThumbnailCaptionProps } from './PageThumbnailCaption';
import { PageThumbnailTitle, type PageThumbnailTitleProps } from './PageThumbnailTitle';
import { PageThumbnailDropdown } from './PageThumbnailDropdown';

export const PageThumbnail = {
  Root: PostThumbnail.Root,
  Image: PostThumbnail.Image,
  Link: PostThumbnail.Link,
  Caption: PageThumbnailCaption,
  Title: PageThumbnailTitle,
  Dropdown: PageThumbnailDropdown,
};

export type {
  PostThumbnailRootProps,
  PostThumbnailImageProps,
  PostThumbnailLinkProps,
  PageThumbnailCaptionProps,
  PageThumbnailTitleProps,
};
