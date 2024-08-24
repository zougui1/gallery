import Link from 'next/link';

import { usePostThumbnail } from './context';

export const PostThumbnailLink = (props: PostThumbnailLinkProps) => {
  const { post } = usePostThumbnail();

  return (
    <Link {...props} href={`/api/media/${post._id}`} />
  );
}

export interface PostThumbnailLinkProps extends Omit<React.ComponentProps<typeof Link>, 'href'> {

}
