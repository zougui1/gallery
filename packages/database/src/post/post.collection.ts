import type { Aggregate, AggregateOptions, MongooseBaseQueryOptions, MongooseQueryOptions, MongooseUpdateQueryOptions, PipelineStage, ProjectionType, QueryOptions, RootFilterQuery, Types, UpdateQuery, UpdateWithAggregationPipeline, mongo } from 'mongoose';

import { type Connection } from 'mongoose';
import { type ReturnModelType } from '@typegoose/typegoose';

import {
  fileSchema,
  imageFileSchema,
  textFileSchema,
  postSchema,
  type PostSchemaWithId,
  type PostSchema,
} from './post.schema';
import { Post } from './post.model';
import { getModel } from '../utils';

type LeanPost = Post & {
  _id: Types.ObjectId;
};

export class PostCollection {
  readonly schema = {
    file: fileSchema,
    imageFile: imageFileSchema,
    textFile: textFileSchema,
    post: postSchema,
  } as const;

  readonly model: ReturnModelType<typeof Post>;

  constructor(connection: Connection) {
    this.model = getModel('posts', Post, {
      connection,
    });
  }

  createOne = async (data: PostSchema): Promise<PostSchemaWithId> => {
    const document = await this.model.create(postSchema.parse(data));
    return this.deserialize(document);
  }

  createMany = async (data: PostSchema[]): Promise<PostSchemaWithId[]> => {
    const documents = await this.model.create(data.map(item => postSchema.parse(item)));
    return documents.map(this.deserialize);
  }

  find = (filter?: RootFilterQuery<Post>, options?: QueryOptions<Post>) => {
    return this.model
      .find(filter ?? {}, {}, options)
      .lean()
      .transform(data => data.map(this.deserialize));
  }

  findById = (id: string, options?: QueryOptions<Post>) => {
    return this.model
      .findById(id, {}, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  findByIdAndDelete = (id: string, options?: QueryOptions<Post>) => {
    return this.model
      .findByIdAndDelete(id, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  findByIdAndUpdate = (id: string, update: UpdateQuery<Post>, options?: QueryOptions<Post>) => {
    return this.model
      .findByIdAndUpdate(id, update, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  findOne = (filter: RootFilterQuery<Post>, options?: QueryOptions<Post>) => {
    return this.model
      .findOne(filter, {}, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  findOneAndDelete = (filter: RootFilterQuery<Post>, options?: QueryOptions<Post>) => {
    return this.model
      .findOneAndDelete(filter, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  findOneAndUpdate = (filter: RootFilterQuery<Post>, update: UpdateQuery<Post>, options?: QueryOptions<Post>) => {
    return this.model
      .findOneAndUpdate(filter, update, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  updateMany = (filter?: RootFilterQuery<Post>, update?: UpdateQuery<Post> | UpdateWithAggregationPipeline, options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<Post>)) => {
    return this.model.updateMany(filter, update, options);
  }

  updateOne = (filter?: RootFilterQuery<Post>, update?: UpdateQuery<Post> | UpdateWithAggregationPipeline, options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<Post>)) => {
    return this.model.updateOne(filter, update, options);
  }

  deleteMany = (filter?: RootFilterQuery<Post>, options?: (mongo.DeleteOptions & MongooseBaseQueryOptions<Post>)) => {
    return this.model.deleteMany(filter, options);
  }

  deleteOne = (filter?: RootFilterQuery<Post>, options?: (mongo.DeleteOptions & MongooseBaseQueryOptions<Post>)) => {
    return this.model.deleteOne(filter, options);
  }

  replaceOne = (filter?: RootFilterQuery<Post>, replacement?: Post, options?: (mongo.ReplaceOptions & MongooseQueryOptions<Post>)) => {
    return this.model.replaceOne(filter, replacement, options);
  }

  aggregate = <R = unknown>(pipeline?: PipelineStage[], options?: AggregateOptions): Aggregate<R[]> => {
    return this.model.aggregate(pipeline, options);
  }

  distinct = (field: string, filter?: RootFilterQuery<Post>, options?: QueryOptions) => {
    return this.model.distinct(field, filter, options);
  }

  deserialize = (document: LeanPost): PostSchemaWithId => {
    return {
      ...postSchema.parse(document),
      _id: document._id.toString(),
    };
  }
}
