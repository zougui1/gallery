import type { Aggregate, AggregateOptions, MongooseBaseQueryOptions, MongooseQueryOptions, MongooseUpdateQueryOptions, PipelineStage, QueryOptions, RootFilterQuery, Types, UpdateQuery, UpdateWithAggregationPipeline, mongo } from 'mongoose';
import { type Connection } from 'mongoose';
import { type ReturnModelType } from '@typegoose/typegoose';
import { type PostSchemaWithId, type PostSchema } from './post.schema';
import { Post } from './post.model';
type LeanPost = Post & {
    _id: Types.ObjectId;
};
export declare class PostCollection {
    readonly schema: {
        readonly file: import("zod").ZodObject<{
            fileName: import("zod").ZodString;
            contentType: import("zod").ZodString;
            hash: import("zod").ZodOptional<import("zod").ZodString>;
            checksum: import("zod").ZodOptional<import("zod").ZodString>;
            size: import("zod").ZodNumber;
        }, "strip", import("zod").ZodTypeAny, {
            fileName: string;
            contentType: string;
            size: number;
            hash?: string | undefined;
            checksum?: string | undefined;
        }, {
            fileName: string;
            contentType: string;
            size: number;
            hash?: string | undefined;
            checksum?: string | undefined;
        }>;
        readonly imageFile: import("zod").ZodObject<import("zod").objectUtil.extendShape<{
            fileName: import("zod").ZodString;
            contentType: import("zod").ZodString;
            hash: import("zod").ZodOptional<import("zod").ZodString>;
            checksum: import("zod").ZodOptional<import("zod").ZodString>;
            size: import("zod").ZodNumber;
        }, {
            width: import("zod").ZodNumber;
            height: import("zod").ZodNumber;
        }>, "strip", import("zod").ZodTypeAny, {
            fileName: string;
            contentType: string;
            size: number;
            width: number;
            height: number;
            hash?: string | undefined;
            checksum?: string | undefined;
        }, {
            fileName: string;
            contentType: string;
            size: number;
            width: number;
            height: number;
            hash?: string | undefined;
            checksum?: string | undefined;
        }>;
        readonly textFile: import("zod").ZodObject<{
            fileName: import("zod").ZodString;
            contentType: import("zod").ZodString;
            hash: import("zod").ZodOptional<import("zod").ZodString>;
            checksum: import("zod").ZodOptional<import("zod").ZodString>;
            size: import("zod").ZodNumber;
        }, "strip", import("zod").ZodTypeAny, {
            fileName: string;
            contentType: string;
            size: number;
            hash?: string | undefined;
            checksum?: string | undefined;
        }, {
            fileName: string;
            contentType: string;
            size: number;
            hash?: string | undefined;
            checksum?: string | undefined;
        }>;
        readonly post: import("zod").ZodObject<{
            sourceUrl: import("zod").ZodString;
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
                id: import("zod").ZodString;
                label: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id: string;
                label: string;
            }, {
                id: string;
                label: string;
            }>>;
            similarity: import("zod").ZodOptional<import("zod").ZodObject<{
                id: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>>;
            title: import("zod").ZodString;
            contentType: import("zod").ZodEnum<[import("@zougui/gallery.enums").PostType, ...import("@zougui/gallery.enums").PostType[]]>;
            rating: import("zod").ZodEnum<[import("@zougui/gallery.enums").PostRating, ...import("@zougui/gallery.enums").PostRating[]]>;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            keywords: import("zod").ZodArray<import("zod").ZodString, "many">;
            author: import("zod").ZodOptional<import("zod").ZodObject<{
                name: import("zod").ZodString;
                url: import("zod").ZodString;
                avatar: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                name: string;
                url: string;
                avatar: string;
            }, {
                name: string;
                url: string;
                avatar: string;
            }>>;
            file: import("zod").ZodUnion<[import("zod").ZodObject<import("zod").objectUtil.extendShape<{
                fileName: import("zod").ZodString;
                contentType: import("zod").ZodString;
                hash: import("zod").ZodOptional<import("zod").ZodString>;
                checksum: import("zod").ZodOptional<import("zod").ZodString>;
                size: import("zod").ZodNumber;
            }, {
                width: import("zod").ZodNumber;
                height: import("zod").ZodNumber;
            }>, "strip", import("zod").ZodTypeAny, {
                fileName: string;
                contentType: string;
                size: number;
                width: number;
                height: number;
                hash?: string | undefined;
                checksum?: string | undefined;
            }, {
                fileName: string;
                contentType: string;
                size: number;
                width: number;
                height: number;
                hash?: string | undefined;
                checksum?: string | undefined;
            }>, import("zod").ZodObject<{
                fileName: import("zod").ZodString;
                contentType: import("zod").ZodString;
                hash: import("zod").ZodOptional<import("zod").ZodString>;
                checksum: import("zod").ZodOptional<import("zod").ZodString>;
                size: import("zod").ZodNumber;
            }, "strip", import("zod").ZodTypeAny, {
                fileName: string;
                contentType: string;
                size: number;
                hash?: string | undefined;
                checksum?: string | undefined;
            }, {
                fileName: string;
                contentType: string;
                size: number;
                hash?: string | undefined;
                checksum?: string | undefined;
            }>]>;
            thumbnail: import("zod").ZodObject<{
                original: import("zod").ZodObject<{
                    fileName: import("zod").ZodString;
                    contentType: import("zod").ZodString;
                    size: import("zod").ZodNumber;
                    width: import("zod").ZodNumber;
                    height: import("zod").ZodNumber;
                }, "strip", import("zod").ZodTypeAny, {
                    fileName: string;
                    contentType: string;
                    size: number;
                    width: number;
                    height: number;
                }, {
                    fileName: string;
                    contentType: string;
                    size: number;
                    width: number;
                    height: number;
                }>;
                small: import("zod").ZodObject<{
                    fileName: import("zod").ZodString;
                    contentType: import("zod").ZodString;
                    size: import("zod").ZodNumber;
                    width: import("zod").ZodNumber;
                    height: import("zod").ZodNumber;
                }, "strip", import("zod").ZodTypeAny, {
                    fileName: string;
                    contentType: string;
                    size: number;
                    width: number;
                    height: number;
                }, {
                    fileName: string;
                    contentType: string;
                    size: number;
                    width: number;
                    height: number;
                }>;
            }, "strip", import("zod").ZodTypeAny, {
                original: {
                    fileName: string;
                    contentType: string;
                    size: number;
                    width: number;
                    height: number;
                };
                small: {
                    fileName: string;
                    contentType: string;
                    size: number;
                    width: number;
                    height: number;
                };
            }, {
                original: {
                    fileName: string;
                    contentType: string;
                    size: number;
                    width: number;
                    height: number;
                };
                small: {
                    fileName: string;
                    contentType: string;
                    size: number;
                    width: number;
                    height: number;
                };
            }>;
            attachment: import("zod").ZodOptional<import("zod").ZodObject<{
                fileName: import("zod").ZodString;
                contentType: import("zod").ZodString;
                sourceUrl: import("zod").ZodString;
                size: import("zod").ZodNumber;
            }, "strip", import("zod").ZodTypeAny, {
                fileName: string;
                contentType: string;
                size: number;
                sourceUrl: string;
            }, {
                fileName: string;
                contentType: string;
                size: number;
                sourceUrl: string;
            }>>;
            postedAt: import("zod").ZodDate;
            createdAt: import("zod").ZodDate;
            removedAt: import("zod").ZodOptional<import("zod").ZodDate>;
            originalData: import("zod").ZodOptional<import("zod").ZodObject<{
                id: import("zod").ZodNumber;
                url: import("zod").ZodString;
                type: import("zod").ZodEnum<["image", "story", "music", "flash", "unknown"]>;
                rating: import("zod").ZodEnum<["General", "Mature", "Adult"]>;
                title: import("zod").ZodString;
                thumbnailUrl: import("zod").ZodString;
                contentUrl: import("zod").ZodString;
                author: import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    url: import("zod").ZodString;
                    avatar: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    url: string;
                    name: string;
                    avatar: string;
                }, {
                    url: string;
                    name: string;
                    avatar: string;
                }>;
                descriptionText: import("zod").ZodString;
                descriptionHtml: import("zod").ZodString;
                keywords: import("zod").ZodArray<import("zod").ZodString, "many">;
                postedAt: import("zod").ZodDate;
            }, "strip", import("zod").ZodTypeAny, {
                url: string;
                title: string;
                id: number;
                type: "unknown" | "image" | "story" | "music" | "flash";
                rating: "General" | "Mature" | "Adult";
                thumbnailUrl: string;
                contentUrl: string;
                descriptionText: string;
                descriptionHtml: string;
                keywords: string[];
                postedAt: Date;
                author: {
                    url: string;
                    name: string;
                    avatar: string;
                };
            }, {
                url: string;
                title: string;
                id: number;
                type: "unknown" | "image" | "story" | "music" | "flash";
                rating: "General" | "Mature" | "Adult";
                thumbnailUrl: string;
                contentUrl: string;
                descriptionText: string;
                descriptionHtml: string;
                keywords: string[];
                postedAt: Date;
                author: {
                    url: string;
                    name: string;
                    avatar: string;
                };
            }>>;
        }, "strip", import("zod").ZodTypeAny, {
            contentType: import("@zougui/gallery.enums").PostType;
            sourceUrl: string;
            title: string;
            rating: import("@zougui/gallery.enums").PostRating;
            keywords: string[];
            file: {
                fileName: string;
                contentType: string;
                size: number;
                hash?: string | undefined;
                checksum?: string | undefined;
            } | {
                fileName: string;
                contentType: string;
                size: number;
                width: number;
                height: number;
                hash?: string | undefined;
                checksum?: string | undefined;
            };
            thumbnail: {
                original: {
                    fileName: string;
                    contentType: string;
                    size: number;
                    width: number;
                    height: number;
                };
                small: {
                    fileName: string;
                    contentType: string;
                    size: number;
                    width: number;
                    height: number;
                };
            };
            postedAt: Date;
            createdAt: Date;
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
            similarity?: {
                id: string;
            } | undefined;
            description?: string | undefined;
            author?: {
                name: string;
                url: string;
                avatar: string;
            } | undefined;
            attachment?: {
                fileName: string;
                contentType: string;
                size: number;
                sourceUrl: string;
            } | undefined;
            removedAt?: Date | undefined;
            originalData?: {
                url: string;
                title: string;
                id: number;
                type: "unknown" | "image" | "story" | "music" | "flash";
                rating: "General" | "Mature" | "Adult";
                thumbnailUrl: string;
                contentUrl: string;
                descriptionText: string;
                descriptionHtml: string;
                keywords: string[];
                postedAt: Date;
                author: {
                    url: string;
                    name: string;
                    avatar: string;
                };
            } | undefined;
        }, {
            contentType: import("@zougui/gallery.enums").PostType;
            sourceUrl: string;
            title: string;
            rating: import("@zougui/gallery.enums").PostRating;
            keywords: string[];
            file: {
                fileName: string;
                contentType: string;
                size: number;
                hash?: string | undefined;
                checksum?: string | undefined;
            } | {
                fileName: string;
                contentType: string;
                size: number;
                width: number;
                height: number;
                hash?: string | undefined;
                checksum?: string | undefined;
            };
            thumbnail: {
                original: {
                    fileName: string;
                    contentType: string;
                    size: number;
                    width: number;
                    height: number;
                };
                small: {
                    fileName: string;
                    contentType: string;
                    size: number;
                    width: number;
                    height: number;
                };
            };
            postedAt: Date;
            createdAt: Date;
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
            similarity?: {
                id: string;
            } | undefined;
            description?: string | undefined;
            author?: {
                name: string;
                url: string;
                avatar: string;
            } | undefined;
            attachment?: {
                fileName: string;
                contentType: string;
                size: number;
                sourceUrl: string;
            } | undefined;
            removedAt?: Date | undefined;
            originalData?: {
                url: string;
                title: string;
                id: number;
                type: "unknown" | "image" | "story" | "music" | "flash";
                rating: "General" | "Mature" | "Adult";
                thumbnailUrl: string;
                contentUrl: string;
                descriptionText: string;
                descriptionHtml: string;
                keywords: string[];
                postedAt: Date;
                author: {
                    url: string;
                    name: string;
                    avatar: string;
                };
            } | undefined;
        }>;
    };
    readonly model: ReturnModelType<typeof Post>;
    constructor(connection: Connection);
    createOne: (data: PostSchema) => Promise<PostSchemaWithId>;
    createMany: (data: PostSchema[]) => Promise<PostSchemaWithId[]>;
    find: (filter?: RootFilterQuery<Post>, options?: QueryOptions<Post>) => import("mongoose").QueryWithHelpers<PostSchemaWithId[], import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Post> & Omit<Post & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, Post, "find", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    findById: (id: string, options?: QueryOptions<Post>) => import("mongoose").QueryWithHelpers<PostSchemaWithId | null, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Post> & Omit<Post & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, Post, "findOne", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    findByIdAndDelete: (id: string, options?: QueryOptions<Post>) => import("mongoose").QueryWithHelpers<PostSchemaWithId | null, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Post> & Omit<Post & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, Post, "findOneAndDelete", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    findByIdAndUpdate: (id: string, update: UpdateQuery<Post>, options?: QueryOptions<Post>) => import("mongoose").QueryWithHelpers<PostSchemaWithId | null, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Post> & Omit<Post & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, Post, "findOneAndUpdate", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    findOne: (filter: RootFilterQuery<Post>, options?: QueryOptions<Post>) => import("mongoose").QueryWithHelpers<PostSchemaWithId | null, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Post> & Omit<Post & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, Post, "findOne", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    findOneAndDelete: (filter: RootFilterQuery<Post>, options?: QueryOptions<Post>) => import("mongoose").QueryWithHelpers<PostSchemaWithId | null, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Post> & Omit<Post & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, Post, "findOneAndDelete", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    findOneAndUpdate: (filter: RootFilterQuery<Post>, update: UpdateQuery<Post>, options?: QueryOptions<Post>) => import("mongoose").QueryWithHelpers<PostSchemaWithId | null, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Post> & Omit<Post & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, Post, "findOneAndUpdate", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    updateMany: (filter?: RootFilterQuery<Post>, update?: UpdateQuery<Post> | UpdateWithAggregationPipeline, options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<Post>)) => import("mongoose").QueryWithHelpers<import("mongoose").UpdateWriteOpResult, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Post> & Omit<Post & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, Post, "updateMany", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    updateOne: (filter?: RootFilterQuery<Post>, update?: UpdateQuery<Post> | UpdateWithAggregationPipeline, options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<Post>)) => import("mongoose").QueryWithHelpers<import("mongoose").UpdateWriteOpResult, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Post> & Omit<Post & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, Post, "updateOne", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    deleteMany: (filter?: RootFilterQuery<Post>, options?: (mongo.DeleteOptions & MongooseBaseQueryOptions<Post>)) => import("mongoose").QueryWithHelpers<mongo.DeleteResult, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Post> & Omit<Post & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, Post, "deleteMany", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    deleteOne: (filter?: RootFilterQuery<Post>, options?: (mongo.DeleteOptions & MongooseBaseQueryOptions<Post>)) => import("mongoose").QueryWithHelpers<mongo.DeleteResult, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Post> & Omit<Post & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, Post, "deleteOne", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    replaceOne: (filter?: RootFilterQuery<Post>, replacement?: Post, options?: (mongo.ReplaceOptions & MongooseQueryOptions<Post>)) => import("mongoose").QueryWithHelpers<import("mongoose").UpdateWriteOpResult, import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Post> & Omit<Post & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, Post, "replaceOne", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    aggregate: <R = unknown>(pipeline?: PipelineStage[], options?: AggregateOptions) => Aggregate<R[]>;
    distinct: (field: string, filter?: RootFilterQuery<Post>, options?: QueryOptions) => import("mongoose").QueryWithHelpers<unknown[], import("mongoose").Document<unknown, import("@typegoose/typegoose/lib/types").BeAnObject, Post> & Omit<Post & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }, "typegooseName"> & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction, import("@typegoose/typegoose/lib/types").BeAnObject, Post, "distinct", import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction>;
    deserialize: (document: LeanPost) => PostSchemaWithId;
}
export {};
//# sourceMappingURL=post.collection.d.ts.map