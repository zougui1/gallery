import mongoose from 'mongoose';
import { getModelForClass, type ReturnModelType } from '@typegoose/typegoose';
import type { Constructor } from 'type-fest';

export const getModel = <T extends Constructor<T>>(collectionName: string, model: T): ReturnModelType<T> => {
  const cachedModel = mongoose.models[collectionName] as ReturnModelType<T> | undefined;
  return cachedModel ?? getModelForClass(model, {
    options: { customName: collectionName },
  });
}
