import type { FlattenMaps, Types } from 'mongoose';
import { type z } from 'zod';

import { busyStatuses } from '~/server/workers';

import { PostQueueModel, type PostQueue } from './post-queue.model';
import {
  postQueueSchema,
  type PostQueueSchemaWithId,
  type PostQueueStepSchema,
} from './post-queue.schema';

type LeanPostQueue = FlattenMaps<PostQueue> & {
  _id: Types.ObjectId;
};

export class PostQueueQuery {
  create = async (data: z.input<typeof postQueueSchema>): Promise<PostQueueSchemaWithId> => {
    const document = await PostQueueModel.create(postQueueSchema.parse(data));
    return this.deserialize(document);
  }

  createMany = async (data: z.input<typeof postQueueSchema>[]): Promise<PostQueueSchemaWithId[]> => {
    const documents = await PostQueueModel.create(data.map(d => postQueueSchema.parse(d)));
    return documents.map(this.deserialize);
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

  findOneBusy = async (): Promise<PostQueueSchemaWithId | undefined> => {
    const [postQueue] = await PostQueueModel
      .aggregate<PostQueueSchemaWithId>()
      .addFields({
        lastStep: {
          $last: '$steps',
        },
      })
      .match({
        'lastStep.status': {
          $in: busyStatuses,
        },
      })
      .limit(1)
      .project({
        lastStep: 0,
      });

    return postQueue;
  }

  findOneIdle = async (): Promise<PostQueueSchemaWithId | undefined> => {
    const [postQueue] = await PostQueueModel
      .aggregate<PostQueueSchemaWithId>()
      .addFields({
        lastStep: {
          $last: '$steps',
        },
      })
      .match({
        'steps.0': {
          $exists: false,
        },
      })
      .sort({
        createdAt: 1,
      })
      .limit(1)
      .project({
        lastStep: 0,
      });

    return postQueue;
  }

  private deserialize = (document: LeanPostQueue): PostQueueSchemaWithId => {
    return {
      ...postQueueSchema.parse(document),
      _id: document._id.toString(),
    };
  }
}
