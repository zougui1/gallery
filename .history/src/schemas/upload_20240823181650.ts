import { z } from 'zod';
import { unique } from 'radash';

import { FurAffinityClient } from '@zougui/furaffinity';

import { nullifyEmptyString, removeTrailing } from '~/utils';
import { PostSeriesType } from '~/enums';

const normalizedHostName = 'www.furaffinity.net';

const normalizeUrl = (url: string): string => {
  return removeTrailing(FurAffinityClient.URL.normalizeHostName(url, normalizedHostName), '/');
}

export const seriesUploadSchema = z.object({
  id: z.string().min(1),
  type: z.enum(Object.values(PostSeriesType) as [PostSeriesType, ...PostSeriesType[]]),
  name: z.string().min(1),
  chapterName: z.string().optional(),
  chapterIndex: z.number().min(1).int(),
  partIndex: z.number().min(1).int(),
});

export const altUploadSchema = z.object({
  id: z.string(),
  label: z.preprocess(nullifyEmptyString, z.string()),
});

export const baseSubmissionUploadSchema = z.object({
  createdAt: z.date(),
  url: z.preprocess(
    nullifyEmptyString,
    z.string().url().transform(normalizeUrl),
  ),
  attachmentUrl: z.preprocess(
    nullifyEmptyString,
    z.string().url().optional().transform(url => url ? normalizeUrl(url) : url),
  ),
  title: z.preprocess(nullifyEmptyString, z.string().default('Untitled')),
  keywords: z.array(z.string().min(1)).transform(keywords => unique(keywords)),
  description: z.preprocess(nullifyEmptyString, z.string().optional()),
});

export const submissionUploadSchema = {
  asSingle: baseSubmissionUploadSchema,
  asAlt: baseSubmissionUploadSchema.extend({
    alt: altUploadSchema,
  }),
  asStoryChapter: baseSubmissionUploadSchema.extend({
    series:seriesUploadSchema,
  }),
  asAny: baseSubmissionUploadSchema.extend({
    alt: altUploadSchema.optional(),
    series: seriesUploadSchema.optional(),
  }),
};

export type SubmissionUploadSchema = {
  asSingle: z.infer<typeof submissionUploadSchema.asSingle>;
  asAlt: z.infer<typeof submissionUploadSchema.asAlt>;
  asStoryChapter: z.infer<typeof submissionUploadSchema.asStoryChapter>;
  asAny: z.infer<typeof submissionUploadSchema.asAny>;
};
