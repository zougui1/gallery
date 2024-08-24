import mongoose from 'mongoose';
import { getModelForClass, type ReturnModelType } from '@typegoose/typegoose';
import type { Constructor } from 'type-fest';

export const getModel = <T extends Constructor<unknown>>(collectionName: string, model: T): ReturnModelType<T> => {
  delete mongoose.models[collectionName];

  const cachedModel = mongoose.models[collectionName] as ReturnModelType<T> | undefined;
  return cachedModel ?? getModelForClass(model, {
    options: { customName: collectionName },
  });
}
