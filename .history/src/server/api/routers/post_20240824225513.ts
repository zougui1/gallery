import { z } from 'zod';
import { unique, group, sort } from 'radash';

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
      id: z.string(),
    }))
    .query(async ({ input }) => {
      return await DB.post.query.findById(input.id);
    }),

  findManyById: publicProcedure
    .input(z.object({
      postIds: z.array(z.string()),
    }))
    .query(async ({ input }) => {
      const posts = await DB.post.query.findManyById(input.postIds);

      const altIds = posts.map(post => post.alt?.id).filter(Boolean).map(v => v!);
      const seriesIds = posts.map(post => post.series?.id).filter(Boolean).map(v => v!);

      const [altSubmissions, seriesSubmissions] = await Promise.all([
        DB.post.query.findManyByAltId(unique(altIds)),
        DB.post.query.findManyBySeriesId(unique(seriesIds)),
      ]);

      const altGroups = group(altSubmissions, submission => submission.alt?.id ?? '');
      const serieGroups = group(seriesSubmissions, submission => submission.series?.id ?? '');

      const postMap = new Map(posts.map(post => [post._id, post]));

      return input.postIds
        .flatMap(id => {
          const post = postMap.get(id);

          if (!post) {
            return;
          }

          if (post.series) {
            const parts = serieGroups[post.series.id];

            if (!parts) {
              return [];
            }

            delete serieGroups[post.series.id];

            return sort(parts, p => p.createdAt.getTime()).flatMap(part => {
              if (!part.alt) {
                return part;
              }

              const alts = altGroups[part.alt.id];

              if (!alts) {
                return [];
              }

              delete altGroups[part.alt.id];
              return sort(alts, p => p.createdAt.getTime());
            });
          }

          if (!post.alt) {
            return post;
          }

          const alts = altGroups[post.alt.id];

          if (!alts) {
            return [];
          }

          delete altGroups[post.alt.id];
          return sort(alts, p => p.createdAt.getTime());
        })
        .filter(Boolean);
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
