import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';

export const postQueueRouter = createTRPCRouter({
  create: publicProcedure
    .input(DB.postQueue.schema.postQueue)
    .mutation(async ({ input }) => {
      await DB.postQueue.query.create(input);
    }),
});
