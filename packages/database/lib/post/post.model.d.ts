import { PostType, PostRating, PostSeriesType } from '@zougui/gallery.enums';
export declare class PostFile {
    fileName: string;
    contentType: string;
    hash?: string;
    checksum?: string;
    size: number;
    width?: number;
    height?: number;
}
export declare class PostAttachment {
    fileName: string;
    contentType: string;
    sourceUrl: string;
    size: number;
}
export declare class PostThumbnailFile {
    fileName: string;
    contentType: string;
    size: number;
    width: number;
    height: number;
}
export declare class PostThumbnail {
    original: string;
    small: string;
}
export declare class Author {
    name: string;
    url: string;
    avatar?: string;
}
export declare class PostSeriesMetadata {
    id: string;
    type: PostSeriesType;
    name: string;
    chapterName?: string;
    chapterIndex: number;
    partIndex: number;
}
export declare class PostAltMetadata {
    id: string;
    label: string;
}
export declare class PostSimilarityMetadata {
    id: string;
}
export declare class Post {
    sourceUrl: string;
    series?: PostSeriesMetadata;
    alt?: PostAltMetadata;
    similarity?: PostSimilarityMetadata;
    title: string;
    contentType: PostType;
    rating: PostRating;
    description?: string;
    keywords: string[];
    author?: Author;
    file: PostFile;
    attachment?: PostAttachment;
    thumbnail: PostThumbnail;
    postedAt: Date;
    createdAt: Date;
    removedAt?: Date;
    originalData?: unknown;
}
//# sourceMappingURL=post.model.d.ts.map