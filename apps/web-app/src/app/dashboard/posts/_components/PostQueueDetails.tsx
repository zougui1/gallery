import { DateTime } from 'luxon';

import { AppLink } from '~/app/_components/atoms/AppLink';
import { formatDate } from '~/app/_utils';
import { type PostQueueSchemaWithId } from '~/server/database';

export const PostQueueDetails = ({ post }: PostQueueDetailsProps) => {
  return (
    <div className="flex flex-col">
      <AppLink.External href={post.url}>{post.url}</AppLink.External>
      <span>
        {post.keywords.length
          ? `Keywords: ${post.keywords.join(', ')}`
          : 'no keywords'
        }
      </span>
      <span>
        Date: {formatDate(post.createdAt, DateTime.DATETIME_SHORT)}
      </span>
    </div>
  );
}

export interface PostQueueDetailsProps {
  post: PostQueueSchemaWithId;
}
