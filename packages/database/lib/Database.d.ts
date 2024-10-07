import mongoose from 'mongoose';
import { PostCollection } from './post';
import { PostQueueCollection } from './post-queue';
export declare class Database {
    readonly connection: mongoose.Connection;
    readonly post: PostCollection;
    readonly postQueue: PostQueueCollection;
    constructor(uri: string);
}
//# sourceMappingURL=Database.d.ts.map