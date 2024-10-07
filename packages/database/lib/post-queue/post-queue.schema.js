"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postQueueSchema = void 0;
const zod_1 = require("zod");
const radash_1 = require("radash");
const gallery_enums_1 = require("@zougui/gallery.enums");
const gallery_utils_1 = require("@zougui/gallery.utils");
const step = zod_1.z.object({
    status: zod_1.z.enum(gallery_enums_1.postQueueStatusValues),
    message: zod_1.z.string().optional(),
    date: zod_1.z.date(),
    errorList: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.postQueueSchema = zod_1.z.object({
    createdAt: zod_1.z.date(),
    url: zod_1.z.preprocess(gallery_utils_1.nullifyEmptyString, zod_1.z.string().url().transform(gallery_utils_1.normalizeUrl)),
    attachmentUrl: zod_1.z.preprocess(gallery_utils_1.nullifyEmptyString, zod_1.z.string().url().optional().transform(url => url ? (0, gallery_utils_1.normalizeUrl)(url) : url)),
    series: zod_1.z.object({
        id: zod_1.z.string().min(1),
        type: zod_1.z.enum(gallery_enums_1.postSeriesTypeValues),
        name: zod_1.z.string().min(1),
        chapterName: zod_1.z.string().optional(),
        chapterIndex: zod_1.z.number().min(1).int(),
        partIndex: zod_1.z.number().min(1).int(),
    }).optional(),
    alt: zod_1.z.object({
        id: zod_1.z.preprocess(gallery_utils_1.nullifyEmptyString, zod_1.z.string()),
        label: zod_1.z.preprocess(gallery_utils_1.nullifyEmptyString, zod_1.z.string()),
    }).optional(),
    title: zod_1.z.preprocess(gallery_utils_1.nullifyEmptyString, zod_1.z.string().default('Untitled')),
    keywords: zod_1.z.array(zod_1.z.string().min(1)).transform(keywords => (0, radash_1.unique)(keywords)),
    description: zod_1.z.preprocess(gallery_utils_1.nullifyEmptyString, zod_1.z.string().optional()),
    steps: zod_1.z.array(step).default([]),
    deletedAt: zod_1.z.date().optional(),
});
//# sourceMappingURL=post-queue.schema.js.map