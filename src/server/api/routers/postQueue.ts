import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';
import { submissionUploadSchema } from '~/schemas/upload';
import { postTaskQueue } from '~/server/workers';
import { PostQueueStatus, PostSeriesType } from '~/enums';
import { getEnumValues } from '~/utils';

const checkDuplicate = async (url: string, message = 'This URL has already been uploaded'): Promise<void> => {
  const duplicate = await DB.postQueue.findDuplicate({ url });

  if (duplicate) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message,
    });
  }
}

export const postQueueRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.union([
      z.array(submissionUploadSchema.asStoryChapter),
      z.array(submissionUploadSchema.asAlt),
      submissionUploadSchema.asAny,
    ]))
    .mutation(async ({ input }) => {
      if (!Array.isArray(input)) {
        await checkDuplicate(input.url);

        const postQueue = await DB.postQueue.create(input);
        postTaskQueue.add(postQueue);

        return;
      }

      await Promise.race(input.map(async submission => {
        const errorMessageParts: string[] = [];

        if ('series' in submission) {
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

      input.forEach(v => {
        if ('series' in v) {
          console.log(v.series.chapterIndex, v.series.partIndex);
        } else {
          console.log(v.url);
        }
      });
      const postQueues = await DB.postQueue.createMany(input);

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
      await DB.postQueue.addStep(input.id, {
        date: new Date(),
        status: PostQueueStatus.restarted,
        message: 'The processing of the post has been manually restarted',
      });
      const postQueue = await DB.postQueue.findById(input.id);

      if (!postQueue) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'The post does not exist',
        });
      }

      postTaskQueue.add(postQueue);
    }),

  findBySeriesId: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      return await DB.postQueue.findBySeriesId(input.id);
    }),
});
