import { z } from 'zod';
import { unique } from 'radash';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';

export const postRouter = createTRPCRouter({
  findAllKeywords: publicProcedure.query(async () => {
    const allKeywords = await Promise.all([
      DB.postQueue.query.findAllKeywords(),
      DB.post.query.findAllKeywords(),
    ]);

    return unique(allKeywords.flat());
  }),

  find: publicProcedure
    .query(async () => {
      return await DB.post.query.find();
    }),

  findById: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      return await DB.post.query.findById(input.id);
    }),

  addKeyword: publicProcedure
    .input(z.object({
      id: z.string(),
      keyword: z.string(),
    }))
    .mutation(async ({ input }) => {
      // TODO delete
      //? for test purposes
      if (input.keyword === 'dev_error') {
        throw new Error('Invalid keyword');
      }

      if (input.keyword.startsWith('slow')) {
        await new Promise(r => setTimeout(r, 1000));
      }

      await DB.post.query.addKeyword(input.id, input.keyword);
    }),
});
