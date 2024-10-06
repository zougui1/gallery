import { PostThumbnailRoot, type PostThumbnailRootProps } from './PostThumbnailRoot';
import { PostThumbnailLink, type PostThumbnailLinkProps } from './PostThumbnailLink';
import { PostThumbnailImage, type PostThumbnailImageProps } from './PostThumbnailImage';
import { PostThumbnailTitle, type PostThumbnailTitleProps } from './PostThumbnailTitle';
import { usePostThumbnail } from './context';

export const PostThumbnail = {
  Root: PostThumbnailRoot,
  Link: PostThumbnailLink,
  Image: PostThumbnailImage,
  Title: PostThumbnailTitle,
  useState: usePostThumbnail,
};

export type {
  PostThumbnailRootProps,
  PostThumbnailLinkProps,
  PostThumbnailTitleProps,
  PostThumbnailImageProps,
};
