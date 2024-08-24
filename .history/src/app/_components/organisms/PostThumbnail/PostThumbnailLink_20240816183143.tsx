'use client';

import { usePostThumbnail } from './context';
import { AppLink, type InternalAppLinkProps } from '../../atoms/AppLink';

export const PostThumbnailLink = (props: PostThumbnailLinkProps) => {
  const { post } = usePostThumbnail();

  return (
    <AppLink.Internal {...props} href={`/posts/${post._id}`} />
  );
}

export interface PostThumbnailLinkProps extends Omit<InternalAppLinkProps, 'href'> {

}
