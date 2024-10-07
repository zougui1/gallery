"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = exports.textFileSchema = exports.imageFileSchema = exports.fileSchema = void 0;
const zod_1 = require("zod");
const furaffinity_1 = require("@zougui/furaffinity");
const gallery_enums_1 = require("@zougui/gallery.enums");
exports.fileSchema = zod_1.z.object({
    fileName: zod_1.z.string().min(1),
    contentType: zod_1.z.string().min(1),
    hash: zod_1.z.string().optional(),
    checksum: zod_1.z.string().optional(),
    size: zod_1.z.number().positive(),
});
exports.imageFileSchema = exports.fileSchema.extend({
    width: zod_1.z.number().positive(),
    height: zod_1.z.number().positive(),
});
exports.textFileSchema = exports.fileSchema;
exports.postSchema = zod_1.z.object({
    sourceUrl: zod_1.z.string().url().min(1),
    series: zod_1.z.object({
        id: zod_1.z.string().min(1),
        type: zod_1.z.enum(Object.values(gallery_enums_1.PostSeriesType)),
        name: zod_1.z.string().min(1),
        chapterName: zod_1.z.string().optional(),
        chapterIndex: zod_1.z.number().min(1).int(),
        partIndex: zod_1.z.number().min(1).int(),
    }).optional(),
    alt: zod_1.z.object({
        id: zod_1.z.string().min(1),
        label: zod_1.z.string().min(1),
    }).optional(),
    similarity: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }).optional(),
    title: zod_1.z.string().min(1),
    contentType: zod_1.z.enum(Object.values(gallery_enums_1.PostType)),
    rating: zod_1.z.enum(Object.values(gallery_enums_1.PostRating)),
    description: zod_1.z.string().optional(),
    keywords: zod_1.z.array(zod_1.z.string().min(1)),
    author: zod_1.z.object({
        name: zod_1.z.string().min(1),
        url: zod_1.z.string().url().min(1),
        avatar: zod_1.z.string().url().min(1),
    }).optional(),
    file: zod_1.z.union([exports.imageFileSchema, exports.textFileSchema]),
    thumbnail: zod_1.z.object({
        original: zod_1.z.object({
            fileName: zod_1.z.string().min(1),
            contentType: zod_1.z.string().min(1),
            size: zod_1.z.number().positive(),
            width: zod_1.z.number().positive(),
            height: zod_1.z.number().positive(),
        }),
        small: zod_1.z.object({
            fileName: zod_1.z.string().min(1),
            contentType: zod_1.z.string().min(1),
            size: zod_1.z.number().positive(),
            width: zod_1.z.number().positive(),
            height: zod_1.z.number().positive(),
        }),
    }),
    attachment: zod_1.z.object({
        fileName: zod_1.z.string().min(1),
        contentType: zod_1.z.string().min(1),
        sourceUrl: zod_1.z.string().url().min(1),
        size: zod_1.z.number().positive(),
    }).optional(),
    postedAt: zod_1.z.date(),
    createdAt: zod_1.z.date(),
    removedAt: zod_1.z.date().optional(),
    originalData: furaffinity_1.submissionSchema.optional(),
});
//# sourceMappingURL=post.schema.js.map