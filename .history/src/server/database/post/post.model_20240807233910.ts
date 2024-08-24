import mongoose from 'mongoose';

import { Severity, prop } from '@typegoose/typegoose';

import { getModel } from '../utils';

export enum PostType {
  art = 'art',
  story = 'story',
}

export enum Source {
  furaffinity = 'furaffinity',
  e621 = 'e621',
}

export class PostFile {
  @prop({ required: true })
  fileName!: string;

  @prop({ required: true })
  contentType!: string;

  @prop({ required: true, unique: true, sparse: true })
  hash!: string;
}

export class PostThumbnailFile {
  @prop({ required: true })
  fileName!: string;

  @prop({ required: true })
  contentType!: string;
}

export class PostThumbnail {
  @prop({ type: PostThumbnailFile, required: true, _id: false })
  original!: string;

  @prop({ type: PostThumbnailFile, required: true, _id: false })
  small!: string;
}

export class Author {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  url!: string;

  @prop({ type: String, required: false })
  avatar?: string;
}

export class Post {
  @prop({ required: true, unique: true, index: true })
  sourceUrl!: string;

  @prop({ required: true })
  title!: string;

  @prop({ enum: PostType, type: String, required: true })
  contentType!: PostType;

  @prop({ type: String, required: true })
  description?: string;

  @prop({ type: [String], required: true })
  keywords!: string[];

  @prop({ type: Author, required: false, _id: false })
  author?: Author;

  @prop({ type: PostFile, required: true, _id: false })
  file!: PostFile;

  @prop({ type: PostThumbnail, required: true, _id: false })
  thumbnail!: PostThumbnail;

  @prop({ type: Date, required: true })
  postedAt!: Date;

  @prop({ type: Date, required: true })
  createdAt!: Date;

  @prop({ type: Date, required: false })
  removedAt?: Date;

  @prop({ allowMixed: Severity.ALLOW, type: mongoose.Schema.Types.Mixed, required: false })
  originalData?: unknown;
}
