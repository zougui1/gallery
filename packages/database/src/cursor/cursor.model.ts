import { prop } from '@typegoose/typegoose';

import { Source } from '@zougui/gallery.enums';

import { type WithId } from '../types';

export class Cursor {
  @prop({ type: String, enum: Source, required: true, unique: true, index: true })
  source!: Source;

  @prop({ required: true })
  increment!: number;
}

export type CursorWithId = WithId<Cursor>;
