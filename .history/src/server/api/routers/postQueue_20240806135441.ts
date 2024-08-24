import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { FuraffinityClient } from '@zougui/furaffinity';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';
import { fileUploadSchema, furaffinityUrlUploadSchema, unknownUrlUploadSchema } from '~/schemas/upload';
import { PostQueueStatus } from '~/enums';
import { processPostQueue } from '~/server/workers';

const normalizedHostName = 'www.furaffinity.net';

const createSchema = z.union([
  fileUploadSchema,
  furaffinityUrlUploadSchema,
  unknownUrlUploadSchema,
]);

export const postQueueRouter = createTRPCRouter({
  create: publicProcedure
    .input(createSchema)
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

      const postQueue = await DB.postQueue.query.create({
        ...input,
        ...(normalizedUrl ? { url: normalizedUrl } : {}),
        steps: [
          {
            status: PostQueueStatus.idle,
            date: new Date(),
          },
        ],
      });

      await processPostQueue(postQueue).catch(console.error);
    }),

  find: publicProcedure.query(async () => {
    return await DB.postQueue.query.find();
  }),
});
