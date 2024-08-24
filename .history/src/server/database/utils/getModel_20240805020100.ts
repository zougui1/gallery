import mongoose from 'mongoose';
import { getModelForClass, type ReturnModelType } from '@typegoose/typegoose';
import type { Constructor } from 'type-fest';

export const getModel = <T extends Constructor<unknown>>(collectionName: string, model: T): ReturnModelType<T> => {
  // make sure the model is always up to date
  delete mongoose.models[collectionName];

  return getModelForClass(model, {
    options: { customName: collectionName },
  });
}
