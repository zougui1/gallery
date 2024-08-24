import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';
import { processPostQueue } from '~/server/workers';

export const postRouter = createTRPCRouter({
  findAllKeywords: publicProcedure.query(async () => {
    const [postQueue] = await DB.postQueue.query.find();
    if (postQueue) await processPostQueue(postQueue);

    return await DB.postQueue.query.findAllKeywords();
  }),
});
