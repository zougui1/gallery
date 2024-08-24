import { sort } from 'radash';
import type { FlattenMaps, Types } from 'mongoose';

import { PostQueueStatus } from '~/enums';

import { PostQueueModel, type PostQueue } from './post-queue.model';
import {
  postQueueSchema,
  type PostQueueSchema,
  type PostQueueSchemaWithId,
  type PostQueueStepSchema,
} from './post-queue.schema';

const busyStatuses: PostQueueStatus[] = [
  PostQueueStatus.fetchingData,
  PostQueueStatus.downloadingContent,
  PostQueueStatus.processing,
  PostQueueStatus.checkingDuplicates,
  PostQueueStatus.deleting,
];

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

  findOneBusy = async (): Promise<PostQueueSchema | undefined> => {
    const [postQueue] = await PostQueueModel
      .aggregate<PostQueueSchema>()
      .match({
        $expr: {
          $in: [
            { $last: '$steps.status' },
            busyStatuses,
          ],
        },
      })
      .limit(1);

    return postQueue;
  }

  private deserialize = (document: LeanPostQueue): PostQueueSchemaWithId => {
    return {
      ...postQueueSchema.parse(document),
      _id: document._id.toString(),
    };
  }
}
