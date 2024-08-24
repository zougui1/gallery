import { z } from 'zod';
import { unique } from 'radash';

import { nullifyEmptyString } from '~/utils';

export const altUploadSchema = z.object({
  id: z.string(),
  label: z.preprocess(nullifyEmptyString, z.string()),
});

export const submissionUploadSchema = z.object({
  createdAt: z.date(),
  attachmentUrl: z.preprocess(nullifyEmptyString, z.string().url().optional()),
  url: z.preprocess(nullifyEmptyString, z.string().url()),
  title: z.preprocess(nullifyEmptyString, z.string().default('Untitled')),
  keywords: z.array(z.string().min(1)).transform(keywords => unique(keywords)),
  description: z.preprocess(nullifyEmptyString, z.string().optional()),
  alt: altUploadSchema.optional(),
});
