import { TRPCError } from '@trpc/server';

import { FuraffinityClient } from '@zougui/furaffinity';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';

const normalizedHostName = 'www.furaffinity.net';

export const postQueueRouter = createTRPCRouter({
  create: publicProcedure
    .input(DB.postQueue.schema.postQueue)
    .mutation(async ({ input }) => {
      const hasUrl = 'url' in input;

      if (hasUrl) {
        const duplicate = await DB.postQueue.query.findDuplicate(input);

        if (duplicate) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'This URL has already been uploaded',
          });
        }
      }

      const normalizedUrl = hasUrl
        ? FuraffinityClient.URL.normalizeHostName(input.url, normalizedHostName)
        : undefined;

      await DB.postQueue.query.create({
        ...input,
        ...(normalizedUrl ? { url: normalizedUrl }: {}),
      });
    }),

  find: publicProcedure.query(async () => {
    return await DB.postQueue.query.find();
  }),
});
