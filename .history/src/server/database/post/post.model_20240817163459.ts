import mongoose from 'mongoose';

import { Severity, prop } from '@typegoose/typegoose';

import { PostType, PostRating, PostSuiteType } from '~/enums';

import { getModel } from '../utils';

export class PostFile {
  @prop({ required: true })
  fileName!: string;

  @prop({ required: true })
  contentType!: string;

  @prop({ type: String, required: false })
  hash?: string;

  @prop({ type: String, required: false, unique: true, sparse: true })
  checksum?: string;

  @prop({ type: Number, required: true })
  size!: number;

  @prop({ type: Number, required: false })
  width?: number;

  @prop({ type: Number, required: false })
  height?: number;
}

export class PostAttachment {
  @prop({ required: true })
  fileName!: string;

  @prop({ required: true })
  contentType!: string;

  @prop({ type: String, required: false, unique: true, sparse: true })
  checksum?: string;

  @prop({ type: Number, required: true })
  size!: number;
}

export class PostThumbnailFile {
  @prop({ required: true })
  fileName!: string;

  @prop({ required: true })
  contentType!: string;

  @prop({ type: Number, required: true })
  size!: number;

  @prop({ type: Number, required: true })
  width!: number;

  @prop({ type: Number, required: true })
  height!: number;
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

export class PostSuiteMetadata {
  @prop({ required: true, index: true })
  id!: string;

  @prop({ type: String, enum: PostSuiteType, required: true })
  type!: PostSuiteType;

  @prop({ required: true })
  cahpterIndex!: number;

  @prop({ required: true })
  partIndex!: number;
}

export class PostAltMetadata {
  @prop({ required: true, index: true })
  id!: string;

  @prop({ required: true })
  label!: string;
}

export class PostSimilarityMetadata {
  @prop({ required: true, index: true })
  id!: string;
}

export class Post {
  @prop({ required: true, unique: true, index: true })
  sourceUrl!: string;

  @prop({ type: PostSuiteMetadata, required: false, _id: false })
  suite?: PostSuiteMetadata;

  @prop({ type: PostAltMetadata, required: false, _id: false })
  alt?: PostAltMetadata;

  @prop({ type: PostSimilarityMetadata, required: false, _id: false })
  similarity?: PostSimilarityMetadata;

  @prop({ required: true })
  title!: string;

  @prop({ enum: PostType, type: String, required: true })
  contentType!: PostType;

  @prop({ enum: PostRating, type: String, required: true })
  rating!: PostRating;

  @prop({ type: String, required: false })
  description?: string;

  @prop({ type: [String], required: true })
  keywords!: string[];

  @prop({ type: Author, required: false, _id: false })
  author?: Author;

  @prop({ type: PostFile, required: true, _id: false })
  file!: PostFile;

  @prop({ type: PostAttachment, required: false, _id: false })
  attachment?: PostAttachment;

  @prop({ type: PostThumbnail, required: true, _id: false })
  thumbnail!: PostThumbnail;

  @prop({ type: Date, required: true })
  postedAt!: Date;

  @prop({ type: Date, required: true })
  createdAt!: Date;

  @prop({ type: Date, required: false })
  removedAt?: Date;

  @prop({
    allowMixed: Severity.ALLOW,
    type: mongoose.Schema.Types.Mixed,
    required: false,
    _id: false,
  })
  originalData?: unknown;
}

export const PostModel = getModel('posts', Post);
