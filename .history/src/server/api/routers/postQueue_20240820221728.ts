import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { FurAffinityClient } from '@zougui/furaffinity';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';
import { furaffinityUrlUploadSchema, unknownUrlUploadSchema } from '~/schemas/upload';
import { postTaskQueue } from '~/server/workers';
import { removeTrailing } from '~/utils';
import { PostSeriesType } from '~/enums';
import { nanoid } from 'nanoid';

const normalizedHostName = 'www.furaffinity.net';

const createSchema = z.union([
  furaffinityUrlUploadSchema,
  unknownUrlUploadSchema,
]);

const baseSeriesUnitShape = {
  chapterIndex: z.number().min(1).int(),
  partIndex: z.number().min(1).int(),
};

const createSubmission = async (input: z.infer<typeof createSchema>): Promise<void> => {
  const normalizedUrl = 'url' in input
    ? removeTrailing(FurAffinityClient.URL.normalizeHostName(input.url, normalizedHostName), '/')
    : undefined;
  const normalizedAttachmentUrl = input.attachmentUrl
    ? removeTrailing(FurAffinityClient.URL.normalizeHostName(input.attachmentUrl, normalizedHostName), '/')
    : undefined;

  // TODO do this check
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

  postTaskQueue.add(postQueue);
}

export const postQueueRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.union([createSchema.transform(value => [value]), z.array(createSchema)]))
    .mutation(async ({ input }) => {
      if (input.length === 1) {
        await createSubmission(input[0]!);
        return;
      }

      const altId = nanoid();

      for (const alt of input) {
        await createSubmission(alt);
      }
    }),

  createStorySeries: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      units: z.array(
        z.union([
          furaffinityUrlUploadSchema.extend(baseSeriesUnitShape),
          unknownUrlUploadSchema.extend(baseSeriesUnitShape),
        ])
      ),
    }))
    .mutation(async ({ input }) => {
      console.log(input);
      throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
    }),

  createComic: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      units: z.array(
        z.union([
          furaffinityUrlUploadSchema.extend(baseSeriesUnitShape),
          unknownUrlUploadSchema.extend(baseSeriesUnitShape),
        ])
      ),
    }))
    .mutation(async ({ input }) => {
      console.log(input);
      throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
    }),

  find: publicProcedure.query(async () => {
    return await DB.postQueue.query.find();
  }),
});
