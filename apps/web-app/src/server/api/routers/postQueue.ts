import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { type Types, type FlattenMaps } from 'mongoose';

import { type PostQueueSchemaWithId, type PostQueue } from '@zougui/gallery.database';
import { WorkerType } from '@zougui/gallery.rabbitmq';
import {
  PostQueueStatus,
  PostSeriesType,
  deletableStatuses,
  permanentlyDeletableStatuses,
  postQueueStatusLabelMap,
} from '@zougui/gallery.enums';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';
import { rabbit } from '~/server/rabbitmq';
import { altUploadSchema, seriesUploadSchema, submissionUploadSchema } from '~/schemas/upload';
import { deletePost } from '~/server/workers';
import { getEnumValues } from '~/utils';

const checkDuplicate = async (url: string, message = 'This URL has already been uploaded'): Promise<void> => {
  const duplicate = await DB.postQueue.findOne({ url });

  if (duplicate) {
    throw new TRPCError({
      code: 'CONFLICT',
      message,
    });
  }
}

export interface SearchOptions {
  page: number;
  pageSize: number;
  status?: PostQueueStatus | null;
}

type LeanPostQueue = FlattenMaps<PostQueue> & {
  _id: Types.ObjectId;
};

export interface SearchResult {
  count: number;
  data: PostQueueSchemaWithId[];
}

type SearchAggregateResult = {
  count: [{ count: number }];
  data: LeanPostQueue[];
}

const search = async (options: SearchOptions): Promise<SearchResult> => {
  const { pageSize } = options;
  const pageIndex = Math.max(options.page - 1, 0);

  let aggregate = DB.postQueue.aggregate<SearchAggregateResult>();

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

  console.clear()
  console.log('result.data', result.data)

  return {
    count: result.count?.[0]?.count ?? 0,
    data: result.data.map(DB.postQueue.deserialize),
  };
}

export const postQueueRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      newPosts: z.array(submissionUploadSchema.asAny),
      associatedPosts: z.array(z.object({
        sourceUrl: z.string(),
        alt: altUploadSchema.optional(),
        series: seriesUploadSchema.optional(),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      await Promise.all(input.newPosts.map(async submission => {
        const errorMessageParts: string[] = [];

        if ('series' in submission && submission.series) {
          const { type, chapterIndex, partIndex } = submission.series;
          const partName = type === PostSeriesType.comic ? 'page' : 'part';

          errorMessageParts.push(
            `for the chapter ${chapterIndex}`,
            partName,
            String(partIndex),
          );
        }

        if ('alt' in submission && submission.alt) {
          errorMessageParts.push(`for the alt ${submission.alt.label}`);
        }

        const errorMessage = [
          'The URL',
          ...errorMessageParts,
          'has already been uploaded.',
        ].join(' ');

        await checkDuplicate(submission.url, errorMessage);
      }));

      const [postQueues] = await Promise.all([
        DB.postQueue.createMany(input.newPosts.map(p => ({ ...p, steps: [] }))),
        ...(input.associatedPosts?.flatMap(({ sourceUrl, ...post }) => {
          return [
            DB.post.updateOne({ url: sourceUrl }, post),
            DB.postQueue.updateOne({ url: sourceUrl }, post),
          ];
        }) ?? []),
      ]);

      for (const postQueue of postQueues) {
        await rabbit.galleryWorker.send({
          type: WorkerType.processPost,
          postQueueId: postQueue._id,
        });
      }
    }),

  search: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      status: z.enum(getEnumValues(PostQueueStatus)).optional().nullable(),
    }))
    .query(async ({ input }) => {
      const pageSize = 10;

      const result = await search({
        ...input,
        pageSize,
      });

      return {
        posts: result.data,
        lastPage: Math.ceil(result.count / pageSize),
      };
    }),

  restart: publicProcedure
    .input(z.object({
      id: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const postQueue = await DB.postQueue.findById(input.id);

      if (!postQueue) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'The post does not exist',
        });
      }

      await DB.postQueue.findByIdAndUpdate(postQueue._id, {
        $push: {
          steps: {
            date: new Date(),
            status: PostQueueStatus.restarted,
            message: 'The processing of the post has been manually restarted',
          },
        },
      });

      await rabbit.galleryWorker.send({
        type: WorkerType.processPost,
        postQueueId: postQueue._id,
      });
    }),

  findBySeriesId: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      return await DB.postQueue.find({ 'series.id': input.id });
    }),

  delete: publicProcedure
    .input(z.object({
      id: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const postQueue = await DB.postQueue.findById(input.id);

      if (!postQueue) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'The post does not exist',
        });
      }

      const lastStatus = postQueue.steps[postQueue.steps.length - 1]?.status ?? PostQueueStatus.idle;

      if (!deletableStatuses.includes(lastStatus)) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `You cannot delete a post with the status: ${postQueueStatusLabelMap[lastStatus]}`,
        });
      }

      await deletePost(postQueue);
    }),

    deletePermanently: publicProcedure
      .input(z.object({
        id: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const postQueue = await DB.postQueue.findById(input.id);

        if (!postQueue) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'The post does not exist',
          });
        }

        const lastStatus = postQueue.steps[postQueue.steps.length - 1]?.status ?? PostQueueStatus.idle;

        if (!permanentlyDeletableStatuses.includes(lastStatus)) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: `You cannot permanently delete a post with the status: ${postQueueStatusLabelMap[lastStatus]}`,
          });
        }

        await DB.postQueue.findByIdAndDelete(postQueue._id);
      }),
});
