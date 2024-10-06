import mongoose from 'mongoose';
import { getModelForClass, type ReturnModelType } from '@typegoose/typegoose';
import type { Constructor } from 'type-fest';

import { env } from '~/env';

export const getModel = <T extends Constructor<unknown>>(collectionName: string, model: T): ReturnModelType<T> => {
  if (env.NODE_ENV === 'development') {
    // make sure the model is always up to date in dev mode
    delete mongoose.models[collectionName];
  }

  return getModelForClass(model, {
    options: { customName: collectionName },
  });
}
