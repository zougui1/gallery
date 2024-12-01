import mongoose from 'mongoose';
import { PostCollection } from './post';
import { PostQueueCollection } from './post-queue';
import { CursorCollection } from './cursor';

export class Database {
  readonly connection: mongoose.Connection;
  readonly post: PostCollection;
  readonly postQueue: PostQueueCollection;
  readonly cursor: CursorCollection;

  constructor(uri: string) {
    this.connection = mongoose.createConnection(uri);
    this.connection.set('strictQuery', true);

    this.post = new PostCollection(this.connection);
    this.postQueue = new PostQueueCollection(this.connection);
    this.cursor = new CursorCollection(this.connection);
  }
}
