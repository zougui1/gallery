import { z } from 'zod';
import { unique } from 'radash';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB } from '~/server/database';
import { PostRating, PostType } from '~/enums';

const availablePostRatings = new Set<string>(Object.values(PostRating));
const availablePostTypes = new Set<string>(Object.values(PostType));

export const postRouter = createTRPCRouter({
  findAllKeywords: publicProcedure.query(async () => {
    const allKeywords = await Promise.all([
      DB.postQueue.query.findAllKeywords(),
      DB.post.query.findAllKeywords(),
    ]);

    return unique(allKeywords.flat());
  }),

  find: publicProcedure
    .input(z.object({
      keywords: z.array(z.string().min(1)).optional(),
      ratings: z.array(z.string()).optional().transform(items => {
        return items?.filter(item => availablePostRatings.has(item)) as PostRating[] | undefined;
      }),
      types: z.array(z.string()).optional().transform(items => {
        return items?.filter(item => availablePostTypes.has(item)) as PostType[] | undefined;
      }),
      page: z.number().int().min(1).default(1),
    }).default({}))
    .query(async ({ input }) => {
      return await DB.post.query.search(input);
    }),

  findById: publicProcedure
    .input(z.object({
      postIds: z.string(),
    }))
    .query(async ({ input }) => {
      return await DB.post.query.findById(input.id);
    }),

  findManyById: publicProcedure
    .input(z.object({
      ids: z.array(z.string()),
    }))
    .query(async ({ input }) => {
      return await DB.post.query.findManyById(input.ids);
    }),

  addKeyword: publicProcedure
    .input(z.object({
      id: z.string(),
      keyword: z.string(),
    }))
    .mutation(async ({ input }) => {
      // TODO delete
      //? for test purposes
      if (input.keyword === 'add_error') {
        throw new Error('Invalid keyword');
      }

      if (input.keyword.startsWith('slow')) {
        await new Promise(r => setTimeout(r, 5000));
      }

      await DB.post.query.addKeyword(input.id, input.keyword);
    }),

  removeKeyword: publicProcedure
    .input(z.object({
      id: z.string(),
      keyword: z.string(),
    }))
    .mutation(async ({ input }) => {
      // TODO delete
      //? for test purposes
      if (input.keyword === 'remove_error') {
        throw new Error('Invalid keyword');
      }

      if (input.keyword.startsWith('slow')) {
        await new Promise(r => setTimeout(r, 5000));
      }

      await DB.post.query.removeKeyword(input.id, input.keyword);
    }),
});
