import { z } from 'zod';

import { submissionSchema } from '@zougui/furaffinity';

import { PostType } from '~/enums';

export const postSchema = z.object({
  sourceUrl: z.string().url().min(1),

  suite: z.object({
    id: z.string().min(1),
    page: z.number().min(0).int(),
  }).optional(),

  alt: z.object({
    id: z.string().min(1),
    label: z.string().min(1),
  }).optional(),

  duplicate: z.object({
    id: z.string().min(1),
  }).optional(),

  title: z.string().min(1),
  contentType: z.enum(Object.values(PostType) as [PostType, ...PostType[]]),
  description: z.string().optional(),
  keywords: z.array(z.string().min(1)),

  author: z.object({
    name: z.string().min(1),
    url: z.string().url().min(1),
    avatar: z.string().url().min(1),
  }).optional(),

  file: z.object({
    fileName: z.string().min(1),
    contentType: z.string().min(1),
    hash: z.string().optional(),
  }),

  thumbnail: z.object({
    original: z.object({
      fileName: z.string().min(1),
      contentType: z.string().min(1),
    }),

    small: z.object({
      fileName: z.string().min(1),
      contentType: z.string().min(1),
    }),
  }),

  postedAt: z.date(),
  createdAt: z.date(),
  removedAt: z.date().optional(),

  originalData: submissionSchema.optional(),
});

export interface PostSchema extends z.infer<typeof postSchema> {

}
