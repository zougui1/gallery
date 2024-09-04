import { sort } from 'radash';
import type { FlattenMaps, Types } from 'mongoose';
import { type z } from 'zod';

import { busyStatuses } from '~/server/workers';
import { PostQueueStatus } from '~/enums';

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

  findById = async (id: string): Promise<PostQueueSchemaWithId | undefined> => {
    const document = await PostQueueModel.findById(id).lean();

    if (document) {
      return this.deserialize(document);
    }
  }

  createMany = async (data: z.input<typeof postQueueSchema>[]): Promise<PostQueueSchemaWithId[]> => {
    const documents = await PostQueueModel.create(data.map(d => postQueueSchema.parse(d)));
    return sort(documents.map(this.deserialize), d => d.createdAt.getTime());
  }

  search = async (options: SearchOptions): Promise<SearchResult> => {
    const { pageSize } = options;
    const pageIndex = Math.max(options.page - 1, 0);

    let aggregate = PostQueueModel.aggregate<SearchAggregateResult>();

    if (options.status) {
      aggregate = aggregate
        .addFields({
          lastStatus: {
            $last: '$steps.status',
          },
        })
        .match(options.status === PostQueueStatus.idle ? {
          $or: [
            { lastStatus: options.status },
            {
              steps: { $size: 0 },
            }
          ],
        } : {
          lastStatus: options.status,
        });
    }

    aggregate = aggregate.facet({
      data: [
        {
          $sort: { _id: -1 },
        },
        { $skip: pageIndex * pageSize },
        { $limit: pageSize },
      ],
      count: [
        {
          $count: 'count',
        },
      ],
    });

    const [result] = await aggregate;

    if (!result) {
      return { count: 0, data: [] };
    }

    return {
      count: result.count[0].count,
      data: result.data.map(this.deserialize),
    };
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
      .match({
        'steps.0': {
          $exists: false,
        },
      })
      .sort({
        createdAt: 1,
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

export interface SearchOptions {
  page: number;
  pageSize: number;
  status?: PostQueueStatus | null;
}

export interface SearchResult {
  count: number;
  data: PostQueueSchemaWithId[];
}

type SearchAggregateResult = {
  count: [{ count: number }];
  data: LeanPostQueue[];
}
