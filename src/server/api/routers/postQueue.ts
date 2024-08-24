import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { sort } from 'radash';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';
import { submissionUploadSchema } from '~/schemas/upload';
import { postTaskQueue } from '~/server/workers';
import { PostSeriesType } from '~/enums';

const checkDuplicate = async (url: string, message = 'This URL has already been uploaded'): Promise<void> => {
  const duplicate = await DB.postQueue.query.findDuplicate({ url });

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

        const postQueue = await DB.postQueue.query.create(input);
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

        if ('alt' in submission) {
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
      const postQueues = await DB.postQueue.query.createMany(input);

      for (const postQueue of postQueues) {
        postTaskQueue.add(postQueue);
      }
    }),

  createStorySeries: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      units: z.array(submissionUploadSchema.asAny),
    }))
    .mutation(async ({ input }) => {
      console.log(input);
      throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
    }),

  createComic: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      units: z.array(submissionUploadSchema.asAny),
    }))
    .mutation(async ({ input }) => {
      console.log(input);
      throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
    }),

  find: publicProcedure.query(async () => {
    return await DB.postQueue.query.find();
  }),
});
