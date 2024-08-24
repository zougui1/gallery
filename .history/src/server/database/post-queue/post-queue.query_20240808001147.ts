import type { FlattenMaps, Types } from 'mongoose';

import { PostQueueModel, type PostQueue } from './post-queue.model';
import {
  postQueueSchema,
  type PostQueueSchema,
  type PostQueueSchemaWithId,
  type PostQueueStepSchema,
} from './post-queue.schema';

type LeanPostQueue = FlattenMaps<PostQueue> & {
  _id: Types.ObjectId;
};

export class PostQueueQuery {
  create = async (data: PostQueueSchema) => {
    const document = await PostQueueModel.create(postQueueSchema.parse(data));
    return this.deserialize(document);
  }

  find = async (): Promise<PostQueueSchemaWithId[]> => {
    const documents = await PostQueueModel.find().lean();
    return documents.map(this.deserialize)
  }

  findDuplicate = async ({ url }: { url: string }): Promise<PostQueueSchemaWithId | undefined> => {
    const document = await PostQueueModel.findOne({ url }).lean();

    if (document) {
      return this.deserialize(document);
    }
  }

  addStep = async (id: string, step: PostQueueStepSchema): Promise<void> => {
    await PostQueueModel.findByIdAndUpdate(id, {
      $push: {
        steps: step,
      },
    });
  }

  findAllKeywords = async (): Promise<string[]> => {
    return await PostQueueModel.distinct('keywords');
  }

  private deserialize = (document: LeanPostQueue): PostQueueSchemaWithId => {
    return {
      ...postQueueSchema.parse(document),
      _id: document._id.toString(),
    };
  }
}
