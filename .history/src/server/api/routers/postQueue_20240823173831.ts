import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { sort } from 'radash';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';
import { submissionUploadSchema } from '~/schemas/upload';
import { postTaskQueue } from '~/server/workers';

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
    .input(z.union([submissionUploadSchema.asAny$, z.array(submissionUploadSchema.asAlt)]))
    .mutation(async ({ input }) => {
      if (!Array.isArray(input)) {
        await checkDuplicate(input.url);

        const postQueue = await DB.postQueue.query.create(input);
        postTaskQueue.add(postQueue);

        return;
      }

      await Promise.race(input.map(async submission => {
        await checkDuplicate(submission.url, `The URL for the alt "${submission.alt.label}" has already been uploaded.`);
      }));

      const postQueues = await DB.postQueue.query.createMany(input);

      for (const postQueue of sort(postQueues, p => p.createdAt.getTime())) {
        postTaskQueue.add(postQueue);
      }
    }),

  createStorySeries: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      units: z.array(submissionUploadSchema.asAny$),
    }))
    .mutation(async ({ input }) => {
      console.log(input);
      throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
    }),

  createComic: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      units: z.array(submissionUploadSchema.asAny$),
    }))
    .mutation(async ({ input }) => {
      console.log(input);
      throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
    }),

  find: publicProcedure.query(async () => {
    return await DB.postQueue.query.find();
  }),
});
