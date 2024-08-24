import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';

export const postRouter = createTRPCRouter({
  findAllKeywords: publicProcedure.query(async () => {
    return await DB.postQueue.query.findAllKeywords();
  }),
});
