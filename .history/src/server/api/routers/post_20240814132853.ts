import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';

export const postRouter = createTRPCRouter({
  findAllKeywords: publicProcedure.query(async () => {
    return await DB.postQueue.query.findAllKeywords();
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
});
