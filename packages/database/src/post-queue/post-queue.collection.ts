import type { Aggregate, AggregateOptions, MongooseBaseQueryOptions, MongooseQueryOptions, MongooseUpdateQueryOptions, PipelineStage, ProjectionType, QueryOptions, RootFilterQuery, Types, UpdateQuery, UpdateWithAggregationPipeline, mongo } from 'mongoose';

import { type Connection } from 'mongoose';
import { type ReturnModelType } from '@typegoose/typegoose';

import {
  postQueueSchema,
  type PostQueueSchema,
  type PostQueueSchemaWithId,
} from './post-queue.schema';
import { PostQueue } from './post-queue.model';
import { getModel } from '../utils';

type LeanPostQueue = PostQueue & {
  _id: Types.ObjectId;
};

export class PostQueueCollection {
  readonly schema = {
    postQueue: postQueueSchema,
  } as const;

  readonly model: ReturnModelType<typeof PostQueue>;

  constructor(connection: Connection) {
    this.model = getModel('post-queues', PostQueue, {
      connection,
    });
  }

  createOne = async (data: PostQueueSchema): Promise<PostQueueSchemaWithId> => {
    const document = await this.model.create(postQueueSchema.parse(data));
    return this.deserialize(document);
  }

  createMany = async (data: PostQueueSchema[]): Promise<PostQueueSchemaWithId[]> => {
    const documents = await this.model.create(data.map(item => postQueueSchema.parse(item)));
    return documents.map(this.deserialize);
  }

  find = (filter?: RootFilterQuery<PostQueue>, options?: QueryOptions<PostQueue>) => {
    return this.model
      .find(filter ?? {}, {}, options)
      .lean()
      .transform(data => data.map(this.deserialize));
  }

  findById = (id: string, options?: QueryOptions<PostQueue>) => {
    return this.model
      .findById(id, {}, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  findByIdAndDelete = (id: string, options?: QueryOptions<PostQueue>) => {
    return this.model
      .findByIdAndDelete(id, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  findByIdAndUpdate = (id: string, update: UpdateQuery<PostQueue>, options?: QueryOptions<PostQueue>) => {
    return this.model
      .findByIdAndUpdate(id, update, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  findOne = (filter: RootFilterQuery<PostQueue>, options?: QueryOptions<PostQueue>) => {
    return this.model
      .findOne(filter, {}, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  findOneAndDelete = (filter: RootFilterQuery<PostQueue>, options?: QueryOptions<PostQueue>) => {
    return this.model
      .findOneAndDelete(filter, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  findOneAndUpdate = (filter: RootFilterQuery<PostQueue>, update: UpdateQuery<PostQueue>, options?: QueryOptions<PostQueue>) => {
    return this.model
      .findOneAndUpdate(filter, update, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  updateMany = (filter?: RootFilterQuery<PostQueue>, update?: UpdateQuery<PostQueue> | UpdateWithAggregationPipeline, options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<PostQueue>)) => {
    return this.model.updateMany(filter, update, options);
  }

  updateOne = (filter?: RootFilterQuery<PostQueue>, update?: UpdateQuery<PostQueue> | UpdateWithAggregationPipeline, options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<PostQueue>)) => {
    return this.model.updateOne(filter, update, options);
  }

  deleteMany = (filter?: RootFilterQuery<PostQueue>, options?: (mongo.DeleteOptions & MongooseBaseQueryOptions<PostQueue>)) => {
    return this.model.deleteMany(filter, options);
  }

  deleteOne = (filter?: RootFilterQuery<PostQueue>, options?: (mongo.DeleteOptions & MongooseBaseQueryOptions<PostQueue>)) => {
    return this.model.deleteOne(filter, options);
  }

  replaceOne = (filter?: RootFilterQuery<PostQueue>, replacement?: PostQueue, options?: (mongo.ReplaceOptions & MongooseQueryOptions<PostQueue>)) => {
    return this.model.replaceOne(filter, replacement, options);
  }

  aggregate = <R = unknown>(pipeline?: PipelineStage[], options?: AggregateOptions): Aggregate<R[]> => {
    return this.model.aggregate(pipeline, options);
  }

  distinct = (field: string, filter?: RootFilterQuery<PostQueue>, options?: QueryOptions) => {
    return this.model.distinct(field, filter, options);
  }

  deserialize = (document: LeanPostQueue): PostQueueSchemaWithId => {
    return {
      ...postQueueSchema.parse(document),
      _id: document._id.toString(),
    };
  }
}
