'use client';

import { AppLink, type InternalAppLinkProps } from '~/app/_components/atoms/AppLink';

import { usePostThumbnail } from './context';

export const PostThumbnailLink = (props: PostThumbnailLinkProps) => {
  const { post } = usePostThumbnail();

  return (
    <AppLink.Internal {...props} href={`/posts/${post._id}`} />
  );
}

export interface PostThumbnailLinkProps extends Omit<InternalAppLinkProps, 'href'> {

}
