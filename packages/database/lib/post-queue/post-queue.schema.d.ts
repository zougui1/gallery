import { z } from 'zod';
import type { WithId } from '../types';
declare const step: z.ZodObject<{
    status: z.ZodEnum<[import("@zougui/gallery.enums").PostQueueStatus, ...import("@zougui/gallery.enums").PostQueueStatus[]]>;
    message: z.ZodOptional<z.ZodString>;
    date: z.ZodDate;
    errorList: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    status: import("@zougui/gallery.enums").PostQueueStatus;
    date: Date;
    message?: string | undefined;
    errorList?: string[] | undefined;
}, {
    status: import("@zougui/gallery.enums").PostQueueStatus;
    date: Date;
    message?: string | undefined;
    errorList?: string[] | undefined;
}>;
export declare const postQueueSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    url: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, unknown>;
    attachmentUrl: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>, string | undefined, unknown>;
    series: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<[import("@zougui/gallery.enums").PostSeriesType, ...import("@zougui/gallery.enums").PostSeriesType[]]>;
        name: z.ZodString;
        chapterName: z.ZodOptional<z.ZodString>;
        chapterIndex: z.ZodNumber;
        partIndex: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
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
    alt: z.ZodOptional<z.ZodObject<{
        id: z.ZodEffects<z.ZodString, string, unknown>;
        label: z.ZodEffects<z.ZodString, string, unknown>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
    }, {
        id?: unknown;
        label?: unknown;
    }>>;
    title: z.ZodEffects<z.ZodDefault<z.ZodString>, string, unknown>;
    keywords: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
    description: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    steps: z.ZodDefault<z.ZodArray<z.ZodObject<{
        status: z.ZodEnum<[import("@zougui/gallery.enums").PostQueueStatus, ...import("@zougui/gallery.enums").PostQueueStatus[]]>;
        message: z.ZodOptional<z.ZodString>;
        date: z.ZodDate;
        errorList: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
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
    deletedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
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
export type PostQueueSchema = z.infer<typeof postQueueSchema>;
export type PostQueueStepSchema = z.infer<typeof step>;
export type PostQueueSchemaWithId = WithId<PostQueueSchema>;
export {};
//# sourceMappingURL=post-queue.schema.d.ts.map