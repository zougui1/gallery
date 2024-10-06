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

const POSTS_PER_PAGE = 50;

const search = async (options: SearchOptions): Promise<{ posts: PostSchemaWithId[], hasMore: boolean }> => {
  const keywordsMatch = options.keywords?.length ? {
    keywords: {
      $all: options.keywords,
    },
  } : {};

  const ratingsMatch = options.ratings?.length ? {
    rating: {
      $in: options.ratings,
    },
  } : {};

  const typesMatch = options.types?.length ? {
    contentType: {
      $in: options.types,
    },
  } : {};

  const excludeAltsMatch = options.excludeAlts ? {
    alt: null,
  } : {};

  const excludeSeriesMatch = options.excludeSeries ? {
    series: null,
  } : {};

  const documents = await DB.post
    .find({
      ...keywordsMatch,
      ...ratingsMatch,
      ...typesMatch,
      ...excludeAltsMatch,
      ...excludeSeriesMatch,
    })
    .sort({ createdAt: -1 })
    .skip((options.page - 1) * POSTS_PER_PAGE)
    .limit(POSTS_PER_PAGE + 1)
    .lean();

  const posts = documents.slice(0, POSTS_PER_PAGE).map(DB.post.deserialize);

  return {
    posts,
    hasMore: documents.length > POSTS_PER_PAGE,
  };
}

export interface SearchOptions {
  page: number;
  keywords?: string[];
  ratings?: PostRating[];
  types?: PostType[];
  excludeAlts?: boolean;
  excludeSeries?: boolean;
}


export const postRouter = createTRPCRouter({
  findAllKeywords: publicProcedure.query(async () => {
    const allKeywords = await Promise.all([
      DB.postQueue.distinct('keywords').transform(keywords => keywords.map(String)),
      DB.post.distinct('keywords').transform(keywords => keywords.map(String)),
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
      return await search(input);
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
      return await DB.post.find({ 'series.id': { $in: [input.id] } }).limit(200);
    }),

  findByAltId: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      return await DB.post.find({ 'alt.id': { $in: [input.id] } }).limit(200);
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
        input.postIds && DB.post.find({ _id: { $in: input.postIds } }).limit(200),
        input.altIds && DB.post.find({ 'alt.id': { $in: input.altIds } }).limit(200),
        input.seriesIds && DB.post.find({ 'series.id': { $in: input.seriesIds } }).limit(200),
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
      await DB.post.findByIdAndUpdate(input.id, {
        $addToSet: {
          keywords: input.keyword,
        },
      });
    }),

  removeKeyword: publicProcedure
    .input(z.object({
      id: z.string(),
      keyword: z.string(),
    }))
    .mutation(async ({ input }) => {
      await DB.post.findByIdAndUpdate(input.id, {
        $pull: {
          keywords: input.keyword,
        },
      });
    }),

  setAlt: publicProcedure
    .input(z.object({
      sourceUrl: z.string(),
      alt: altUploadSchema,
    }))
    .mutation(async ({ input }) => {
      const results = await Promise.allSettled([
        DB.post.updateOne({ sourceUrl: input.sourceUrl }, { alt: input.alt }),
        DB.postQueue.updateOne({ sourceUrl: input.sourceUrl }, { alt: input.alt }),
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
        DB.post.updateOne({ sourceUrl: input.sourceUrl }, { series: input.series }),
        DB.postQueue.updateOne({ sourceUrl: input.sourceUrl }, { series: input.series }),
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
        DB.post.updateOne({ sourceUrl: input.sourceUrl }, { $unset: { alt: 1 } }),
        DB.postQueue.updateOne({ sourceUrl: input.sourceUrl }, { $unset: { alt: 1 } }),
      ]);

      const errors = results.map(r => r.status === 'rejected' ? r.reason as unknown : undefined).filter(Boolean);

      if (errors.length) {
        throw new AggregateError(errors);
      }
    }),
});
