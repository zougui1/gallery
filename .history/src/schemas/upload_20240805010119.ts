import { z } from 'zod';
import { unique } from 'radash';

const furaffinityHostNames = [
  'furaffinity.net',
  'xfuraffinity.net',
  'fxfuraffinity.net',
  'vxfuraffinity.net',
].reduce((acc, host) => [...acc, host, `www.${host}`], [] as string[]);

const checkIsFuraffinityUrl = (value: string): boolean => {
  const url = new URL(value);
  return furaffinityHostNames.includes(url.hostname);
}

const baseSchema = z.object({
  createdAt: z.date(),
});

const directUploadSchema = baseSchema.extend({
  fileName: z.string().min(1),
  title: z.string().optional(),
  keywords: z.array(z.string().min(1)).min(1),
  description: z.string().optional(),
});

export const furaffinityUrlUploadSchema = baseSchema.extend({
  url: z.string().url().refine(checkIsFuraffinityUrl),
  keywords: z.array(z.string().min(1)).optional().transform(keywords => keywords && unique(keywords)),
});

export const unknownUrlUploadSchema = baseSchema.extend({
  url: z.string().url(),
  title: z.string(),
  keywords: z.array(z.string().min(1)).min(1).transform(keywords => keywords && unique(keywords)),
  description: z.string().optional(),
});
