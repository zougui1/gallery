import { z } from 'zod';

import { PostQueueStatus } from '~/enums';
import { getEnumValues } from '~/utils';
import { submissionUploadSchema } from '~/schemas/upload';

import type { WithId } from '../types';

const step = z.object({
  status: z.enum(getEnumValues(PostQueueStatus)),
  message: z.string().optional(),
  date: z.date(),
});


export const postQueueSchema = submissionUploadSchema.asEither.extend({
  steps: z.array(step).default([]),
  deletedAt: z.date().optional(),
  str: z.string().default(''),
});

export type PostQueueSchema = z.infer<typeof postQueueSchema>;
export type PostQueueStepSchema = z.infer<typeof step>;
export type PostQueueSchemaWithId = WithId<PostQueueSchema>;
