import { AppLink } from '~/app/_components/atoms/AppLink';
import { type PostSchemaWithId } from '~/server/database';

export const PostMetaNavigation = ({ post }: PostMetaNavigationProps) => {
  if (!post.alt && !post.series) {
    return null;
  }

  return (
    <div>
      {post.series && (
        <AppLink.Internal href={`/series/${post.series.id}`}>
          {post.series.type}
        </AppLink.Internal>
      )}
    </div>
  );
}

export interface PostMetaNavigationProps {
  post: PostSchemaWithId;
}
