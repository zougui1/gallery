'use client';

import { Typography, cn } from '@zougui/react.ui';

import { PostThumbnailLink } from './PostThumbnailLink';
import { usePostThumbnail } from './context';

export const PostThumbnailTitle = ({ className, children, ...rest }: PostThumbnailTitleProps) => {
  const { post } = usePostThumbnail();

  return (
    <figcaption
      {...rest}
      className={cn(
        'w-full table-caption caption-bottom break-words',
        className,
      )}
    >
      <PostThumbnailLink>
        <Typography.Paragraph
          className="text-sm font-semibold text-center break-words transition-all text-blue-100 hover:text-foreground"
        >
          {children ?? post.title}
        </Typography.Paragraph>
      </PostThumbnailLink>
    </figcaption>
  );
}

export interface PostThumbnailTitleProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {

}
