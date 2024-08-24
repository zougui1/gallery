import { z } from 'zod';

import { submissionSchema } from '@zougui/furaffinity';

import { PostType, PostRating, PostSeriesType } from '~/enums';

import { type WithId } from '../types';

const fileSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  hash: z.string().optional(),
  checksum: z.string().optional(),
  size: z.number().positive(),
});

const imageFileSchema = fileSchema.extend({
  width: z.number().positive(),
  height: z.number().positive(),
});

const textFileSchema = fileSchema;

export const postSchema = z.object({
  sourceUrl: z.string().url().min(1),

  series: z.object({
    id: z.string().min(1),
    type: z.enum(Object.values(PostSeriesType) as [PostSeriesType, ...PostSeriesType[]]),
    name: z.string().min(1),
    chapterIndex: z.number().min(1).int(),
    partIndex: z.number().min(1).int(),
  }).optional(),

  alt: z.object({
    id: z.string().min(1),
    label: z.string().min(1),
  }).optional(),

  similarity: z.object({
    id: z.string().min(1),
  }).optional(),

  title: z.string().min(1),
  contentType: z.enum(Object.values(PostType) as [PostType, ...PostType[]]),
  rating: z.enum(Object.values(PostRating) as [PostRating, ...PostRating[]]),
  description: z.string().optional(),
  keywords: z.array(z.string().min(1)),

  author: z.object({
    name: z.string().min(1),
    url: z.string().url().min(1),
    avatar: z.string().url().min(1),
  }).optional(),

  file: z.union([imageFileSchema, textFileSchema]),

  thumbnail: z.object({
    original: z.object({
      fileName: z.string().min(1),
      contentType: z.string().min(1),
      size: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    }),

    small: z.object({
      fileName: z.string().min(1),
      contentType: z.string().min(1),
      size: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    }),
  }),

  attachment: z.object({
    fileName: z.string().min(1),
    contentType: z.string().min(1),
    sourceUrl: z.string().url().min(1),
    size: z.number().positive(),
  }).optional(),

  postedAt: z.date(),
  createdAt: z.date(),
  removedAt: z.date().optional(),

  originalData: submissionSchema.optional(),
});

export type PostSchema = z.infer<typeof postSchema>;
export type PostSchemaWithId = WithId<PostSchema>;
