import { z } from 'zod';
import { unique } from 'radash';

import { postQueueStatusValues, postSeriesTypeValues } from '@zougui/gallery.enums';
import { normalizeUrl, nullifyEmptyString } from '@zougui/gallery.utils';

import type { WithId } from '../types';

const step = z.object({
  status: z.enum(postQueueStatusValues),
  message: z.string().optional(),
  date: z.date(),
  errorList: z.array(z.string()).optional(),
});

export const postQueueSchema = z.object({
  createdAt: z.date(),
  url: z.preprocess(
    nullifyEmptyString,
    z.string().url().transform(normalizeUrl),
  ),
  attachmentUrl: z.preprocess(
    nullifyEmptyString,
    z.string().url().optional().transform(url => url ? normalizeUrl(url) : url),
  ),
  series: z.object({
    id: z.string().min(1),
    type: z.enum(postSeriesTypeValues),
    name: z.string().min(1),
    chapterName: z.string().optional(),
    chapterIndex: z.number().min(1).int(),
    partIndex: z.number().min(1).int(),
  }).optional(),

  alt: z.object({
    id: z.preprocess(nullifyEmptyString, z.string()),
    label: z.preprocess(nullifyEmptyString, z.string()),
  }).optional()
,  title: z.preprocess(nullifyEmptyString, z.string().default('Untitled')),
  keywords: z.array(z.string().min(1)).transform(keywords => unique(keywords)),
  description: z.preprocess(nullifyEmptyString, z.string().optional()),
  steps: z.array(step).default([]),
  deletedAt: z.date().optional(),
});

export type PostQueueSchema = z.infer<typeof postQueueSchema>;
export type PostQueueStepSchema = z.infer<typeof step>;
export type PostQueueSchemaWithId = WithId<PostQueueSchema>;
