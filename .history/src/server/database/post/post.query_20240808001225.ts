import type { FlattenMaps, Types } from 'mongoose';

import { PostModel, type Post } from './post.model';
import { postSchema, type PostSchema } from './post.schema';
import { type WithId } from '../types';

type LeanPost = FlattenMaps<Post> & {
  _id: Types.ObjectId;
};

export class PostQuery {
  create = async (date: PostSchema): Promise<void> => {

  }

  private deserialize = (document: LeanPost): WithId<PostSchema> => {
    return {
      ...postQueueSchema.parse(document),
      _id: document._id.toString(),
    };
  }
}
