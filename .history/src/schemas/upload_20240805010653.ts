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

export const baseUploadSchema = z.object({
  createdAt: z.date(),
});

export const fileUploadSchema = baseUploadSchema.extend({
  title: z.string(),
  keywords: z.array(z.string().min(1)).min(1).transform(keywords => unique(keywords)),
  description: z.string().optional(),
});

export const furaffinityUrlUploadSchema = baseUploadSchema.extend({
  url: z.string().url().refine(checkIsFuraffinityUrl),
  keywords: z.array(z.string().min(1)).optional().transform(keywords => keywords && unique(keywords)),
});

export const unknownUrlUploadSchema = baseUploadSchema.extend({
  url: z.string().url(),
  title: z.string(),
  keywords: z.array(z.string().min(1)).min(1).transform(keywords => unique(keywords)),
  description: z.string().optional(),
});
