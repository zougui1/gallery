import { z } from 'zod';
import { unique } from 'radash';

import { FuraffinityClient } from '@zougui/furaffinity';

export const baseUploadSchema = z.object({
  createdAt: z.date(),
});

export const fileUploadSchema = baseUploadSchema.extend({
  title: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1).transform(keywords => unique(keywords)),
  description: z.string().optional(),
});

export const furaffinityUrlUploadSchema = baseUploadSchema.extend({
  url: z.string().url().min(1).refine(url => FuraffinityClient.URL.checkIsValidHostName(url)),
  keywords: z.array(z.string().min(1)).optional().transform(keywords => keywords && unique(keywords)),
});

export const unknownUrlUploadSchema = baseUploadSchema.extend({
  url: z.string().url().min(1),
  title: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1).transform(keywords => unique(keywords)),
  description: z.string().optional(),
});
