import { z } from 'zod';
import { unique } from 'radash';

import { nullifyEmptyString } from '~/utils';

export const altUploadSchema = z.object({
  id: z.string(),
  label: z.preprocess(nullifyEmptyString, z.string()),
});

export const baseSubmissionUploadSchema = z.object({
  createdAt: z.date(),
  attachmentUrl: z.preprocess(nullifyEmptyString, z.string().url().optional()),
  url: z.preprocess(nullifyEmptyString, z.string().url()),
  title: z.preprocess(nullifyEmptyString, z.string().default('Untitled')),
  keywords: z.array(z.string().min(1)).transform(keywords => unique(keywords)),
  description: z.preprocess(nullifyEmptyString, z.string().optional()),
});

export const submissionUploadSchema = {
  asSingle: baseSubmissionUploadSchema,
  asAlt: baseSubmissionUploadSchema.extend({
    alt: altUploadSchema,
  }),
  asEither: baseSubmissionUploadSchema.extend({
    alt: altUploadSchema.optional(),
  }),
};
