'use client';

import { PostThumbnail, type PostThumbnailTitleProps } from '~/app/_components/organisms/PostThumbnail';

export const PageThumbnailTitle = (props: PageThumbnailTitleProps) => {
  const { post } = PostThumbnail.useState();

  return (
    <PostThumbnail.Title {...props}>
      Page {post.series?.partIndex}
      {post.alt && ` - ${post.alt.label}`}
    </PostThumbnail.Title>
  );
}

export interface PageThumbnailTitleProps extends PostThumbnailTitleProps {

}
