import { z } from 'zod';
import { unique, group, sort } from 'radash';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { DB, type PostSchemaWithId } from '~/server/database';
import { PostRating, PostType } from '~/enums';
import { altUploadSchema, seriesUploadSchema } from '~/schemas/upload';

const availablePostRatings = new Set<string>(Object.values(PostRating));
const availablePostTypes = new Set<string>(Object.values(PostType));

const sortByGroup = (posts: PostSchemaWithId[], getGroupId: (post: PostSchemaWithId) => string | number): PostSchemaWithId[] => {
  const groups = group(posts, getGroupId);
  const sortedPosts: PostSchemaWithId[] = [];

  for (const groupPosts of Object.values(groups)) {
    // this shouldn't happen, for type safety
    if (groupPosts) {
      sortedPosts.push(...sort(groupPosts, p => p.createdAt.getTime()));
    }
  }

  return sortedPosts;
}

export const postRouter = createTRPCRouter({
  findAllKeywords: publicProcedure.query(async () => {
    const allKeywords = await Promise.all([
      DB.postQueue.findAllKeywords(),
      DB.post.findAllKeywords(),
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
      excludeAlts: z.boolean().optional(),
      excludeSeries: z.boolean().optional(),
    }).default({}))
    .query(async ({ input }) => {
      return await DB.post.search(input);
    }),

  findById: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      return await DB.post.findById(input.id);
    }),

  findBySeriesId: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      return await DB.post.findManyBySeriesId([input.id]);
    }),

  findByAltId: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      return await DB.post.findManyByAltId([input.id]);
    }),

  getGallery: publicProcedure
    .input(z.object({
      postIds: z.array(z.string()).optional(),
      altIds: z.array(z.string()).optional(),
      seriesIds: z.array(z.string()).optional(),
    }))
    .query(async ({ input }) => {
      const [
        posts,
        alts,
        series,
      ] = await Promise.all([
        input.postIds && DB.post.findManyById(input.postIds),
        input.altIds && DB.post.findManyByAltId(input.altIds),
        input.seriesIds && DB.post.findManyBySeriesId(input.seriesIds),
      ]);

      const altGroups = sortByGroup(alts ?? [], submission => submission.alt?.id ?? '');
      const serieGroups = sortByGroup(series ?? [], submission => submission.series?.id ?? '');

      return [
        ...sort(posts ?? [], p => p.createdAt.getTime()),
        ...altGroups,
        ...serieGroups,
      ];
    }),

  addKeyword: publicProcedure
    .input(z.object({
      id: z.string(),
      keyword: z.string(),
    }))
    .mutation(async ({ input }) => {
      await DB.post.addKeyword(input.id, input.keyword);
    }),

  removeKeyword: publicProcedure
    .input(z.object({
      id: z.string(),
      keyword: z.string(),
    }))
    .mutation(async ({ input }) => {
      await DB.post.removeKeyword(input.id, input.keyword);
    }),

  setAlt: publicProcedure
    .input(z.object({
      sourceUrl: z.string(),
      alt: altUploadSchema,
    }))
    .mutation(async ({ input }) => {
      const results = await Promise.allSettled([
        DB.post.setAlt(input.sourceUrl, input.alt),
        DB.postQueue.setAlt(input.sourceUrl, input.alt),
      ]);

      const errors = results.map(r => r.status === 'rejected' ? r.reason as unknown : undefined).filter(Boolean);

      if (errors.length) {
        throw new AggregateError(errors);
      }
    }),

  setSeries: publicProcedure
    .input(z.object({
      sourceUrl: z.string(),
      series: seriesUploadSchema,
    }))
    .mutation(async ({ input }) => {
      const results = await Promise.allSettled([
        DB.post.setSeries(input.sourceUrl, input.series),
        DB.postQueue.setSeries(input.sourceUrl, input.series),
      ]);

      const errors = results.map(r => r.status === 'rejected' ? r.reason as unknown : undefined).filter(Boolean);

      if (errors.length) {
        throw new AggregateError(errors);
      }
    }),

  removeAltData: publicProcedure
    .input(z.object({
      sourceUrl: z.string(),
    }))
    .mutation(async ({ input }) => {
      const results = await Promise.allSettled([
        DB.post.removeAlt({ sourceUrl: input.sourceUrl }),
        DB.postQueue.removeAlt({ sourceUrl: input.sourceUrl }),
      ]);

      const errors = results.map(r => r.status === 'rejected' ? r.reason as unknown : undefined).filter(Boolean);

      if (errors.length) {
        throw new AggregateError(errors);
      }
    }),
});
