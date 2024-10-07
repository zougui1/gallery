import { prop } from '@typegoose/typegoose';

import { PostQueueStatus, PostSeriesType } from '@zougui/gallery.enums';

import { getModel } from '../utils';

export class PostQueueStep {
  @prop({ enum: PostQueueStatus, type: String, required: true })
  status!: PostQueueStatus;

  @prop({ type: String, required: false })
  message?: string;

  @prop({ type: [String], required: false })
  errorList?: string[];

  @prop({ type: Date, required: true })
  date!: Date;
}

export class PostQueueAltMetadata {
  @prop({ required: true, index: true })
  id!: string;

  @prop({ required: true })
  label!: string;
}

export class PostQueueSeriesMetadata {
  @prop({ required: true, index: true })
  id!: string;

  @prop({ type: String, enum: PostSeriesType, required: true })
  type!: PostSeriesType;

  @prop({ required: true })
  name!: string;

  @prop({ type: String, required: false })
  chapterName?: string;

  @prop({ required: true })
  chapterIndex!: number;

  @prop({ required: true })
  partIndex!: number;
}

export class PostQueue {
  @prop({ type: PostQueueAltMetadata, required: false, _id: false })
  alt?: PostQueueAltMetadata;

  @prop({ type: PostQueueSeriesMetadata, required: false, _id: false })
  series?: PostQueueSeriesMetadata;

  @prop({ type: [PostQueueStep], required: true, _id: false })
  steps!: PostQueueStep[];

  /**
   * optional as only direct uploads have a file available at this point
   */
  @prop({ type: String, required: false })
  fileName?: string;

  /**
   * optional as direct uploads don't have a URL
   */
  @prop({ type: String, required: true, index: true, unique: true })
  url!: string;

  @prop({ type: String, required: false })
  attachmentUrl?: string;

  /**
   * optional as only direct uploads have a title
   */
  @prop({ type: String, required: false })
  title?: string;

  @prop({ type: [String], required: false })
  keywords?: string[];

  @prop({ type: String, required: false })
  description?: string;

  @prop({ type: Date, required: true })
  createdAt!: Date;

  @prop({ type: Date, required: false })
  deletedAt?: Date;
}
