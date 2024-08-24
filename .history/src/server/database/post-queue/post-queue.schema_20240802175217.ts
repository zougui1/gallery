import { z } from 'zod';
import { unique } from 'radash';

import { PostQueueStatus } from '~/enums';
import { getEnumValues } from '~/utils';

const step = z.object({
  status: z.enum(getEnumValues(PostQueueStatus)),
  message: z.string().optional(),
  date: z.date(),
});

const baseSchema = z.object({
  steps: z.array(step).min(1),
  title: z.string().optional(),
  keywords: z.array(z.string().min(1)).optional().transform(keywords => keywords && unique(keywords)),
  description: z.string().optional(),
  createdAt: z.date(),
});

const directUploadSchema = baseSchema.extend({
  fileName: z.string().min(1),
  title: z.string().optional(),
  keywords: z.array(z.string().min(1)).min(1),
  description: z.string().optional(),
});

const linkUploadSchema = baseSchema.extend({
  fileName: z.string().min(1),
  title: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1),
});

export const schema = z.union([
  directUploadSchema,
  linkUploadSchema,
]);

export type PostQueueSchema = z.infer<typeof schema>;
