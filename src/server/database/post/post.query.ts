import type { Types } from 'mongoose';

import { type PostType, type PostRating } from '~/enums';

import { PostModel, type Post } from './post.model';
import { postSchema, type PostSchema, type PostSchemaWithId } from './post.schema';

type LeanPost = Post & {
  _id: Types.ObjectId;
};

const POSTS_PER_PAGE = 50;

export class PostQuery {
  readonly model = PostModel;

  create = async (data: PostSchema): Promise<PostSchemaWithId> => {
    const document = await PostModel.create(postSchema.parse(data));
    return this.deserialize(document);
  }

  search = async (options: SearchOptions): Promise<{ posts: PostSchemaWithId[], hasMore: boolean }> => {
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

    const documents = await PostModel
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

    const posts = documents.slice(0, POSTS_PER_PAGE).map(this.deserialize);

    return {
      posts,
      hasMore: documents.length > POSTS_PER_PAGE,
    };
  }

  updateById = async (id: string, data: PostSchema): Promise<PostSchemaWithId | undefined> => {
    const document = await PostModel.findByIdAndUpdate(id, postSchema.parse(data));

    if (document) {
      return this.deserialize(document);
    }
  }

  removeAlt = async (query: { _id: string; } | { sourceUrl: string; }): Promise<void> => {
    await PostModel.updateOne(query, { $unset: { alt: 1 } });
  }

  findById = async (id: string): Promise<PostSchemaWithId | undefined> => {
    const document = await PostModel.findById(id).lean();

    if (document) {
      return this.deserialize(document);
    }
  }

  findBySourceUrl = async (sourceUrl: string): Promise<PostSchemaWithId | undefined> => {
    const document = await PostModel.findOne({ sourceUrl }).lean();

    if (document) {
      return this.deserialize(document);
    }
  }

  setAlt = async (sourceUrl: string, alt: NonNullable<PostSchema['alt']>): Promise<void> => {
    await PostModel.updateOne({ sourceUrl }, { alt });
  }

  setSeries = async (sourceUrl: string, series: NonNullable<PostSchema['series']>): Promise<void> => {
    await PostModel.updateOne({ sourceUrl }, { series });
  }

  setAdditionalData = async (sourceUrl: string, data: Partial<Pick<PostSchema, 'series' | 'alt'>>): Promise<void> => {
    await PostModel.updateOne({ sourceUrl }, data);
  }

  findManyById = async (ids: string[]): Promise<PostSchemaWithId[]> => {
    // arbitrary limit. this will never be reached in a real usage
    const documents = await PostModel.find({ _id: { $in: ids } }).limit(200).lean();
    return documents.map(this.deserialize);
  }

  findManyByAltId = async (altIds: string[]): Promise<PostSchemaWithId[]> => {
    // arbitrary limit. this will never be reached in a real usage
    const documents = await PostModel.find({ 'alt.id': { $in: altIds } }).limit(200).lean();
    return documents.map(this.deserialize);
  }

  findManyBySeriesId = async (seriesIds: string[]): Promise<PostSchemaWithId[]> => {
    // arbitrary limit. this will never be reached in a real usage
    const documents = await PostModel.find({ 'series.id': { $in: seriesIds } }).limit(200).lean();
    return documents.map(this.deserialize);
  }

  findAllKeywords = async (): Promise<string[]> => {
    return await PostModel.distinct('keywords');
  }

  addKeyword = async (id: string, keyword: string): Promise<void> => {
    await PostModel.findByIdAndUpdate(id, {
      $addToSet: {
        keywords: keyword,
      },
    });
  }

  removeKeyword = async (id: string, keyword: string): Promise<void> => {
    await PostModel.findByIdAndUpdate(id, {
      $pull: {
        keywords: keyword,
      },
    });
  }

  deleteById = async (id: string): Promise<void> => {
    await PostModel.findByIdAndDelete(id);
  }

  deserialize = (document: LeanPost): PostSchemaWithId => {
    return {
      ...postSchema.parse(document),
      _id: document._id.toString(),
    };
  }
}

export interface SearchOptions {
  page: number;
  keywords?: string[];
  ratings?: PostRating[];
  types?: PostType[];
  excludeAlts?: boolean;
  excludeSeries?: boolean;
}
