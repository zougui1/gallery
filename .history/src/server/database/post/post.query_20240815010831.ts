import type { Types } from 'mongoose';

import { PostModel, type Post } from './post.model';
import { postSchema, type PostSchema, type PostSchemaWithId } from './post.schema';

type LeanPost = Post & {
  _id: Types.ObjectId;
};

export class PostQuery {
  readonly model = PostModel;

  create = async (data: PostSchema): Promise<PostSchemaWithId> => {
    const document = await PostModel.create(postSchema.parse(data));
    return this.deserialize(document);
  }

  find = async (): Promise<PostSchemaWithId[]> => {
    const documents = await PostModel.find().limit(10).lean();
    return documents.map(this.deserialize);
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
