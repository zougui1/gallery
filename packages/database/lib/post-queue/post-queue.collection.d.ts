import type { Aggregate, AggregateOptions, MongooseBaseQueryOptions, MongooseQueryOptions, MongooseUpdateQueryOptions, PipelineStage, QueryOptions, RootFilterQuery, Types, UpdateQuery, UpdateWithAggregationPipeline, mongo } from 'mongoose';
import { type Connection } from 'mongoose';
import { type ReturnModelType } from '@typegoose/typegoose';
import { type PostQueueSchema, type PostQueueSchemaWithId } from './post-queue.schema';
import { PostQueue } from './post-queue.model';
type LeanPostQueue = PostQueue & {
    _id: Types.ObjectId;
};
export declare class PostQueueCollection {
    readonly schema: {
        readonly postQueue: import("zod").ZodObject<{
            createdAt: import("zod").ZodDate;
            url: import("zod").ZodEffects<import("zod").ZodEffects<import("zod").ZodString, string, string>, string, unknown>;
            attachmentUrl: import("zod").ZodEffects<import("zod").ZodEffects<import("zod").ZodOptional<import("zod").ZodString>, string | undefined, string | undefined>, string | undefined, unknown>;
            series: import("zod").ZodOptional<import("zod").ZodObject<{
                id: import("zod").ZodString;
                type: import("zod").ZodEnum<[import("@zougui/gallery.enums").PostSeriesType, ...import("@zougui/gallery.enums").PostSeriesType[]]>;
                name: import("zod").ZodString;
                chapterName: import("zod").ZodOptional<import("zod").ZodString>;
                chapterIndex: import("zod").ZodNumber;
                partIndex: import("zod").ZodNumber;
            }, "strip", import("zod").ZodTypeAny, {
                type: import("@zougui/gallery.enums").PostSeriesType;
                id: string;
                name: string;
                chapterIndex: number;
                partIndex: number;
                chapterName?: string | undefined;
            }, {
                type: import("@zougui/gallery.enums").PostSeriesType;
                id: string;
                name: string;
                chapterIndex: number;
                partIndex: number;
                chapterName?: string | undefined;
            }>>;
            alt: import("zod").ZodOptional<import("zod").ZodObject<{
                id: import("zod").ZodEffects<import("zod").ZodString, string, unknown>;
                label: import("zod").ZodEffects<import("zod").ZodString, string, unknown>;
            }, "strip", import("zod").ZodTypeAny, {
                id: string;
                label: string;
            }, {
                id?: unknown;
                label?: unknown;
            }>>;
            title: import("zod").ZodEffects<import("zod").ZodDefault<import("zod").ZodString>, string, unknown>;
            keywords: import("zod").ZodEffects<import("zod").ZodArray<import("zod").ZodString, "many">, string[], string[]>;
            description: import("zod").ZodEffects<import("zod").ZodOptional<import("zod").ZodString>, string | undefined, unknown>;
            steps: import("zod").ZodDefault<import("zod").ZodArray<import("zod").ZodObject<{
                status: import("zod").ZodEnum<[import("@zougui/gallery.enums").PostQueueStatus, ...import("@zougui/gallery.enums").PostQueueStatus[]]>;
                message: import("zod").ZodOptional<import("zod").ZodString>;
                date: import("zod").ZodDate;
                errorList: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                status: import("@zougui/gallery.enums").PostQueueStatus;
                date: Date;
                message?: string | undefined;
                errorList?: string[] | undefined;
            }, {
                status: import("@zougui/gallery.enums").PostQueueStatus;
                date: Date;
                message?: string | undefined;
                errorList?: string[] | undefined;
            }>, "many">>;
            deletedAt: import("zod").ZodOptional<import("zod").ZodDate>;
        }, "strip", import("zod").ZodTypeAny, {
            createdAt: Date;
            url: string;
            title: string;
            keywords: string[];
            steps: {
                status: import("@zougui/gallery.enums").PostQueueStatus;
                date: Date;
                message?: string | undefined;
                errorList?: string[] | undefined;
            }[];
            attachmentUrl?: string | undefined;
            series?: {
                type: import("@zougui/gallery.enums").PostSeriesType;
                id: string;
                name: string;
                chapterIndex: number;
                partIndex: number;
                chapterName?: string | undefined;
            } | undefined;
            alt?: {
                id: string;
                label: string;
            } | undefined;
            description?: string | undefined;
            deletedAt?: Date | undefined;
        }, {
            createdAt: Date;
            keywords: string[];
            url?: unknown;
            attachmentUrl?: unknown;
            series?: {
                type: import("@zougui/gallery.enums").PostSeriesType;
                id: string;
                name: string;
                chapterIndex: number;
                partIndex: number;
                chapterName?: string | undefined;
            } | undefined;
            alt?: {
                id?: unknown;
                label?: unknown;
            } | undefined;
            title?: unknown;
            description?: unknown;
            steps?: {
                status: import("@zougui/gallery.enums").PostQueueStatus;
                date: Date;
                message?: string | undefined;
                errorList?: string[] | undefined;
            }[] | undefined;
            deletedAt?: Date | undefined;
        }>;
    };
    readonly model: ReturnModelType<typeof PostQueue>;
    constructor(connection: Connection);
    createOne: (data: PostQueueSchema) => Promise<PostQueueSchemaWithId>;
    createMany: (data: PostQueueSchema[]) => Promise<PostQueueSchemaWithId[]>;
    find: (filter?: RootFilterQuery<PostQueue>, options?: QueryOptions<PostQueue>) => import("mongoose").QueryWithHelpers<PostQueueSchemaWithId[], import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue> & Omit<PostQueue & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue, "find", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    findById: (id: string, options?: QueryOptions<PostQueue>) => import("mongoose").QueryWithHelpers<PostQueueSchemaWithId | null, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue> & Omit<PostQueue & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue, "findOne", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    findByIdAndDelete: (id: string, options?: QueryOptions<PostQueue>) => import("mongoose").QueryWithHelpers<PostQueueSchemaWithId | null, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue> & Omit<PostQueue & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue, "findOneAndDelete", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    findByIdAndUpdate: (id: string, update: UpdateQuery<PostQueue>, options?: QueryOptions<PostQueue>) => import("mongoose").QueryWithHelpers<PostQueueSchemaWithId | null, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue> & Omit<PostQueue & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue, "findOneAndUpdate", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    findOne: (filter: RootFilterQuery<PostQueue>, options?: QueryOptions<PostQueue>) => import("mongoose").QueryWithHelpers<PostQueueSchemaWithId | null, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue> & Omit<PostQueue & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue, "findOne", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    findOneAndDelete: (filter: RootFilterQuery<PostQueue>, options?: QueryOptions<PostQueue>) => import("mongoose").QueryWithHelpers<PostQueueSchemaWithId | null, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue> & Omit<PostQueue & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue, "findOneAndDelete", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    findOneAndUpdate: (filter: RootFilterQuery<PostQueue>, update: UpdateQuery<PostQueue>, options?: QueryOptions<PostQueue>) => import("mongoose").QueryWithHelpers<PostQueueSchemaWithId | null, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue> & Omit<PostQueue & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue, "findOneAndUpdate", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    updateMany: (filter?: RootFilterQuery<PostQueue>, update?: UpdateQuery<PostQueue> | UpdateWithAggregationPipeline, options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<PostQueue>)) => import("mongoose").QueryWithHelpers<import("mongoose").UpdateWriteOpResult, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue> & Omit<PostQueue & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue, "updateMany", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    updateOne: (filter?: RootFilterQuery<PostQueue>, update?: UpdateQuery<PostQueue> | UpdateWithAggregationPipeline, options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<PostQueue>)) => import("mongoose").QueryWithHelpers<import("mongoose").UpdateWriteOpResult, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue> & Omit<PostQueue & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue, "updateOne", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    deleteMany: (filter?: RootFilterQuery<PostQueue>, options?: (mongo.DeleteOptions & MongooseBaseQueryOptions<PostQueue>)) => import("mongoose").QueryWithHelpers<mongo.DeleteResult, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue> & Omit<PostQueue & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue, "deleteMany", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    deleteOne: (filter?: RootFilterQuery<PostQueue>, options?: (mongo.DeleteOptions & MongooseBaseQueryOptions<PostQueue>)) => import("mongoose").QueryWithHelpers<mongo.DeleteResult, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue> & Omit<PostQueue & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue, "deleteOne", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    replaceOne: (filter?: RootFilterQuery<PostQueue>, replacement?: PostQueue, options?: (mongo.ReplaceOptions & MongooseQueryOptions<PostQueue>)) => import("mongoose").QueryWithHelpers<import("mongoose").UpdateWriteOpResult, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue> & Omit<PostQueue & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue, "replaceOne", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    aggregate: <R = unknown>(pipeline?: PipelineStage[], options?: AggregateOptions) => Aggregate<R[]>;
    distinct: (field: string, filter?: RootFilterQuery<PostQueue>, options?: QueryOptions) => import("mongoose").QueryWithHelpers<unknown[], import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue> & Omit<PostQueue & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, PostQueue, "distinct", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    deserialize: (document: LeanPostQueue) => PostQueueSchemaWithId;
}
export {};
//# sourceMappingURL=post-queue.collection.d.ts.map