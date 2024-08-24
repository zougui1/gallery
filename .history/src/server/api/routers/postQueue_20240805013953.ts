import { TRPCError } from '@trpc/server';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';

export const postQueueRouter = createTRPCRouter({
  create: publicProcedure
    .input(DB.postQueue.schema.postQueue)
    .mutation(async ({ input }) => {
      if ('url' in input) {
        const duplicate = await DB.postQueue.query.findDuplicate(input);

        if (duplicate) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'This URL has already been uploaded',
          });
        }
      }

      await DB.postQueue.query.create(input);
    }),

  find: publicProcedure.query(async () => {
    return await DB.postQueue.query.find();
  }),
});
