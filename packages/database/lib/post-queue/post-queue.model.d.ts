import { PostQueueStatus, PostSeriesType } from '@zougui/gallery.enums';
export declare class PostQueueStep {
    status: PostQueueStatus;
    message?: string;
    errorList?: string[];
    date: Date;
}
export declare class PostQueueAltMetadata {
    id: string;
    label: string;
}
export declare class PostQueueSeriesMetadata {
    id: string;
    type: PostSeriesType;
    name: string;
    chapterName?: string;
    chapterIndex: number;
    partIndex: number;
}
export declare class PostQueue {
    alt?: PostQueueAltMetadata;
    series?: PostQueueSeriesMetadata;
    steps: PostQueueStep[];
    /**
     * optional as only direct uploads have a file available at this point
     */
    fileName?: string;
    /**
     * optional as direct uploads don't have a URL
     */
    url: string;
    attachmentUrl?: string;
    /**
     * optional as only direct uploads have a title
     */
    title?: string;
    keywords?: string[];
    description?: string;
    createdAt: Date;
    deletedAt?: Date;
}
//# sourceMappingURL=post-queue.model.d.ts.map