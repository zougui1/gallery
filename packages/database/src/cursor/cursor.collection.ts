import type { Aggregate, AggregateOptions, MongooseBaseQueryOptions, MongooseQueryOptions, MongooseUpdateQueryOptions, PipelineStage, ProjectionType, QueryOptions, RootFilterQuery, Types, UpdateQuery, UpdateWithAggregationPipeline, mongo } from 'mongoose';

import { type Connection } from 'mongoose';
import { type ReturnModelType } from '@typegoose/typegoose';

import { Cursor, CursorWithId } from './cursor.model';
import { getModel } from '../utils';

type LeanCursor = Cursor & {
  _id: Types.ObjectId;
};

export class CursorCollection {
  readonly model: ReturnModelType<typeof Cursor>;

  constructor(connection: Connection) {
    this.model = getModel('cursors', Cursor, {
      connection,
    });
  }

  createOne = async (data: Cursor): Promise<CursorWithId> => {
    const document = await this.model.create(data);
    return this.deserialize(document);
  }

  createMany = async (data: Cursor[]): Promise<CursorWithId[]> => {
    const documents = await this.model.create(data);
    return documents.map(this.deserialize);
  }

  find = (filter?: RootFilterQuery<Cursor>, options?: QueryOptions<Cursor>) => {
    return this.model
      .find(filter ?? {}, {}, options)
      .lean()
      .transform(data => data.map(this.deserialize));
  }

  findById = (id: string, options?: QueryOptions<Cursor>) => {
    return this.model
      .findById(id, {}, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  findByIdAndDelete = (id: string, options?: QueryOptions<Cursor>) => {
    return this.model
      .findByIdAndDelete(id, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  findByIdAndUpdate = (id: string, update: UpdateQuery<Cursor>, options?: QueryOptions<Cursor>) => {
    return this.model
      .findByIdAndUpdate(id, update, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  findOne = (filter: RootFilterQuery<Cursor>, options?: QueryOptions<Cursor>) => {
    return this.model
      .findOne(filter, {}, options)
      .transform(data => data ? this.deserialize(data) : data)
      .lean();
  }

  findOneAndDelete = (filter: RootFilterQuery<Cursor>, options?: QueryOptions<Cursor>) => {
    return this.model
      .findOneAndDelete(filter, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  findOneAndUpdate = (filter: RootFilterQuery<Cursor>, update: UpdateQuery<Cursor>, options?: QueryOptions<Cursor>) => {
    return this.model
      .findOneAndUpdate(filter, update, options)
      .transform(data => data ? this.deserialize(data) : data);
  }

  updateMany = (filter?: RootFilterQuery<Cursor>, update?: UpdateQuery<Cursor> | UpdateWithAggregationPipeline, options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<Cursor>)) => {
    return this.model.updateMany(filter, update, options);
  }

  updateOne = (filter?: RootFilterQuery<Cursor>, update?: UpdateQuery<Cursor> | UpdateWithAggregationPipeline, options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<Cursor>)) => {
    return this.model.updateOne(filter, update, options);
  }

  deleteMany = (filter?: RootFilterQuery<Cursor>, options?: (mongo.DeleteOptions & MongooseBaseQueryOptions<Cursor>)) => {
    return this.model.deleteMany(filter, options);
  }

  deleteOne = (filter?: RootFilterQuery<Cursor>, options?: (mongo.DeleteOptions & MongooseBaseQueryOptions<Cursor>)) => {
    return this.model.deleteOne(filter, options);
  }

  replaceOne = (filter?: RootFilterQuery<Cursor>, replacement?: Cursor, options?: (mongo.ReplaceOptions & MongooseQueryOptions<Cursor>)) => {
    return this.model.replaceOne(filter, replacement, options);
  }

  aggregate = <R = unknown>(pipeline?: PipelineStage[], options?: AggregateOptions): Aggregate<R[]> => {
    return this.model.aggregate(pipeline, options);
  }

  distinct = (field: string, filter?: RootFilterQuery<Cursor>, options?: QueryOptions) => {
    return this.model.distinct(field, filter, options);
  }

  deserialize = (document: LeanCursor): CursorWithId => {
    return {
      ...document,
      _id: document._id.toString(),
    };
  }
}
