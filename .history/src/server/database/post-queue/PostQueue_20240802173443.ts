import { prop } from '@typegoose/typegoose';

import { PostQueueStatus } from '~/enums';

export class PostQueueStep {
  @prop({ enum: PostQueueStatus, type: String, required: true })
  status!: PostQueueStatus;

  @prop({ type: String, required: true })
  message?: string;

  @prop({ type: Date, required: true })
  date!: Date;
}

export class PostQueue {
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
  @prop({ type: String, required: false })
  url?: string;

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
}
