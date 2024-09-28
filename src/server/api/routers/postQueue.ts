import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';
import { altUploadSchema, seriesUploadSchema, submissionUploadSchema } from '~/schemas/upload';
import { deletePost, postTaskQueue } from '~/server/workers';
import { PostQueueStatus, PostSeriesType, deletableStatuses, permanentlyDeletableStatuses, postQueueStatusLabelMap } from '~/enums';
import { getEnumValues } from '~/utils';

const checkDuplicate = async (url: string, message = 'This URL has already been uploaded'): Promise<void> => {
  const duplicate = await DB.postQueue.findDuplicate({ url });

  if (duplicate) {
    throw new TRPCError({
      code: 'CONFLICT',
      message,
    });
  }
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
        DB.postQueue.createMany(input.newPosts),
        ...(input.associatedPosts?.flatMap(post => {
          return [
            DB.post.setAdditionalData(post.sourceUrl, post),
            DB.postQueue.setAdditionalData(post.sourceUrl, post),
          ];
        }) ?? []),
      ]);

      for (const postQueue of postQueues) {
        postTaskQueue.add(postQueue);
      }
    }),

  search: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      status: z.enum(getEnumValues(PostQueueStatus)).optional().nullable(),
    }))
    .query(async ({ input }) => {
      const pageSize = 10;

      const result = await DB.postQueue.search({
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

      await DB.postQueue.addStep(postQueue._id, {
        date: new Date(),
        status: PostQueueStatus.restarted,
        message: 'The processing of the post has been manually restarted',
      });

      postTaskQueue.add(postQueue);
    }),

  findBySeriesId: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      return await DB.postQueue.findBySeriesId(input.id);
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

        await DB.postQueue.deleteById(postQueue._id);
      }),
});
