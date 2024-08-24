import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';
import { exec } from '~/server/worker/exec';

export const postRouter = createTRPCRouter({
  findAllKeywords: publicProcedure.query(async () => {
    exec();
    return await DB.postQueue.query.findAllKeywords();
  }),
});
