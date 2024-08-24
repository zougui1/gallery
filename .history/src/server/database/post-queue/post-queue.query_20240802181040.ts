import type { FlattenMaps, Types } from 'mongoose';
import { PostQueueModel, type PostQueue } from './post-queue.model';
import { postQueueSchema, type PostQueueSchema, type PostQueueSchemaWithId } from './post-queue.schema';

type LeanPostQueue = FlattenMaps<PostQueue> & {
  _id: Types.ObjectId;
};

export class PostQueueQuery {
  create = async (data: PostQueueSchema) => {
    await PostQueueModel.create(postQueueSchema.parse(data));
  }

  find = async (): Promise<PostQueueSchemaWithId[]> => {
    const documents = await PostQueueModel.find().lean();
    return documents.map(this.deserialize)
  }

  private deserialize = (document: LeanPostQueue): PostQueueSchemaWithId => {
    return {
      ...postQueueSchema.parse(document),
      _id: document._id.toString(),
    };
  }
}
