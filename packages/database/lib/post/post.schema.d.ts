import { z } from 'zod';
import { PostType, PostRating, PostSeriesType } from '@zougui/gallery.enums';
import { type WithId } from '../types';
export declare const fileSchema: z.ZodObject<{
    fileName: z.ZodString;
    contentType: z.ZodString;
    hash: z.ZodOptional<z.ZodString>;
    checksum: z.ZodOptional<z.ZodString>;
    size: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
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
export declare const imageFileSchema: z.ZodObject<z.objectUtil.extendShape<{
    fileName: z.ZodString;
    contentType: z.ZodString;
    hash: z.ZodOptional<z.ZodString>;
    checksum: z.ZodOptional<z.ZodString>;
    size: z.ZodNumber;
}, {
    width: z.ZodNumber;
    height: z.ZodNumber;
}>, "strip", z.ZodTypeAny, {
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
export declare const textFileSchema: z.ZodObject<{
    fileName: z.ZodString;
    contentType: z.ZodString;
    hash: z.ZodOptional<z.ZodString>;
    checksum: z.ZodOptional<z.ZodString>;
    size: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
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
export declare const postSchema: z.ZodObject<{
    sourceUrl: z.ZodString;
    series: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<[PostSeriesType, ...PostSeriesType[]]>;
        name: z.ZodString;
        chapterName: z.ZodOptional<z.ZodString>;
        chapterIndex: z.ZodNumber;
        partIndex: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: PostSeriesType;
        name: string;
        id: string;
        chapterIndex: number;
        partIndex: number;
        chapterName?: string | undefined;
    }, {
        type: PostSeriesType;
        name: string;
        id: string;
        chapterIndex: number;
        partIndex: number;
        chapterName?: string | undefined;
    }>>;
    alt: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
    }, {
        id: string;
        label: string;
    }>>;
    similarity: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>>;
    title: z.ZodString;
    contentType: z.ZodEnum<[PostType, ...PostType[]]>;
    rating: z.ZodEnum<[PostRating, ...PostRating[]]>;
    description: z.ZodOptional<z.ZodString>;
    keywords: z.ZodArray<z.ZodString, "many">;
    author: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        url: z.ZodString;
        avatar: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        url: string;
        avatar: string;
    }, {
        name: string;
        url: string;
        avatar: string;
    }>>;
    file: z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
        fileName: z.ZodString;
        contentType: z.ZodString;
        hash: z.ZodOptional<z.ZodString>;
        checksum: z.ZodOptional<z.ZodString>;
        size: z.ZodNumber;
    }, {
        width: z.ZodNumber;
        height: z.ZodNumber;
    }>, "strip", z.ZodTypeAny, {
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
    }>, z.ZodObject<{
        fileName: z.ZodString;
        contentType: z.ZodString;
        hash: z.ZodOptional<z.ZodString>;
        checksum: z.ZodOptional<z.ZodString>;
        size: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
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
    thumbnail: z.ZodObject<{
        original: z.ZodObject<{
            fileName: z.ZodString;
            contentType: z.ZodString;
            size: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
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
        small: z.ZodObject<{
            fileName: z.ZodString;
            contentType: z.ZodString;
            size: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
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
    }, "strip", z.ZodTypeAny, {
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
    attachment: z.ZodOptional<z.ZodObject<{
        fileName: z.ZodString;
        contentType: z.ZodString;
        sourceUrl: z.ZodString;
        size: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
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
    postedAt: z.ZodDate;
    createdAt: z.ZodDate;
    removedAt: z.ZodOptional<z.ZodDate>;
    originalData: z.ZodOptional<z.ZodObject<{
        id: z.ZodNumber;
        url: z.ZodString;
        type: z.ZodEnum<["image", "story", "music", "flash", "unknown"]>;
        rating: z.ZodEnum<["General", "Mature", "Adult"]>;
        title: z.ZodString;
        thumbnailUrl: z.ZodString;
        contentUrl: z.ZodString;
        author: z.ZodObject<{
            name: z.ZodString;
            url: z.ZodString;
            avatar: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
            name: string;
            avatar: string;
        }, {
            url: string;
            name: string;
            avatar: string;
        }>;
        descriptionText: z.ZodString;
        descriptionHtml: z.ZodString;
        keywords: z.ZodArray<z.ZodString, "many">;
        postedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
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
}, "strip", z.ZodTypeAny, {
    contentType: PostType;
    sourceUrl: string;
    title: string;
    rating: PostRating;
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
        type: PostSeriesType;
        name: string;
        id: string;
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
    contentType: PostType;
    sourceUrl: string;
    title: string;
    rating: PostRating;
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
        type: PostSeriesType;
        name: string;
        id: string;
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
export type PostSchema = z.infer<typeof postSchema>;
export type PostSchemaWithId = WithId<PostSchema>;
//# sourceMappingURL=post.schema.d.ts.map