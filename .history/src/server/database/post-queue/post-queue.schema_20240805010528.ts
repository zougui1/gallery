import { z } from 'zod';
import { unique } from 'radash';

import { PostQueueStatus } from '~/enums';
import { getEnumValues } from '~/utils';
import * as uploadSchemas from '~/schemas/upload';

const step = z.object({
  status: z.enum(getEnumValues(PostQueueStatus)),
  message: z.string().optional(),
  date: z.date(),
});

const baseSchema = z.object({
  ...uploadSchemas.baseUploadSchema.shape,
  steps: z.array(step).min(1),
});

const directUploadSchema = baseSchema.extend({
  ...uploadSchemas.directUploadSchema.shape,
  fileName: z.string().min(1),
});

const furaffinityUrlUploadSchema = baseSchema.extend({
  ...uploadSchemas.furaffinityUrlUploadSchema.shape,
});

export const unknownUrlUploadSchema = baseSchema.extend({
  ...uploadSchemas.unknownUrlUploadSchema.shape,
});

export const postQueueSchema = z.union([
  directUploadSchema,
  furaffinityUrlUploadSchema,
  unknownUrlUploadSchema,
]);

export type PostQueueSchema = z.infer<typeof postQueueSchema>;
export type PostQueueSchemaWithId = PostQueueSchema & { _id: string };
