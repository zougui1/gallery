import { PostThumbnailRoot, type PostThumbnailRootProps } from './PostThumbnailRoot';
import { PostThumbnailLink, type PostThumbnailLinkProps } from './PostThumbnailLink';
import { PostThumbnailImage } from './PostThumbnailImage';
import { PostThumbnailTitle, type PostThumbnailTitleProps } from './PostThumbnailTitle';

export const PostThumbnail = {
  Root: PostThumbnailRoot,
  Link: PostThumbnailLink,
  Image: PostThumbnailImage,
  Title: PostThumbnailTitle,
};

export type {
  PostThumbnailRootProps,
  PostThumbnailLinkProps,
  PostThumbnailTitleProps,
};
