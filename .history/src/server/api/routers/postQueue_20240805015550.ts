import { TRPCError } from '@trpc/server';

import { FuraffinityClient } from '@zougui/furaffinity';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';

const normalizedHostName = 'www.furaffinity.net';

export const postQueueRouter = createTRPCRouter({
  create: publicProcedure
    .input(DB.postQueue.schema.postQueue)
    .mutation(async ({ input }) => {
      const normalizedUrl = 'url' in input
        ? FuraffinityClient.URL.normalizeHostName(input.url, normalizedHostName)
        : undefined;

      if (normalizedUrl) {
        const duplicate = await DB.postQueue.query.findDuplicate({
          url: normalizedUrl,
        });

        if (duplicate) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'This URL has already been uploaded',
          });
        }
      }

      await DB.postQueue.query.create({
        ...input,
        ...(normalizedUrl ? { url: normalizedUrl }: {}),
      });
    }),

  find: publicProcedure.query(async () => {
    return await DB.postQueue.query.find();
  }),
});
