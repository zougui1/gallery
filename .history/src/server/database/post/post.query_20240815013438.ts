import type { Types } from 'mongoose';

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

  search = async (options: FindOptions): Promise<{ posts: PostSchemaWithId[], hasMore: boolean }> => {
    const keywordsMatch = options.keywords?.length ? {
      keywords: {
        $all: options.keywords,
      },
    } : {};

    const documents = await PostModel
      .find(keywordsMatch)
      .sort({ _id: -1 })
      .skip((options.page - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE + 1)
      .lean();

    const posts = documents.slice(0, POSTS_PER_PAGE).map(this.deserialize);
    console.log('documents', documents.length)

    return {
      posts,
      hasMore: documents.length > POSTS_PER_PAGE,
    };
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

  deserialize = (document: LeanPost): PostSchemaWithId => {
    return {
      ...postSchema.parse(document),
      _id: document._id.toString(),
    };
  }
}

export interface FindOptions {
  page: number;
  keywords?: string[];
}
