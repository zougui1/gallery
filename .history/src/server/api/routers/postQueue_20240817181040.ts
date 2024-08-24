import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { FurAffinityClient } from '@zougui/furaffinity';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';
import { fileUploadSchema, furaffinityUrlUploadSchema, unknownUrlUploadSchema } from '~/schemas/upload';
import { postTaskQueue } from '~/server/workers';

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
        ? FurAffinityClient.URL.normalizeHostName(input.url, normalizedHostName)
        : undefined;
      const normalizedAttachmentUrl = input.attachmentUrl
        ? FurAffinityClient.URL.normalizeHostName(input.attachmentUrl, normalizedHostName)
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
        attachmentUrl: normalizedAttachmentUrl,
        steps: [],
      });

      const busyPostQueue = await DB.postQueue.query.findOneBusy();

      if (busyPostQueue) {
        return;
      }

      postTaskQueue.add(postQueue);
    }),

  find: publicProcedure.query(async () => {
    return await DB.postQueue.query.find();
  }),
});
