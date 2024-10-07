import mongoose from 'mongoose';
import { getModelForClass, type ReturnModelType } from '@typegoose/typegoose';
import type { Constructor } from 'type-fest';

export const getModel = <T extends Constructor<unknown>>(collectionName: string, model: T, options?: ModelOptions): ReturnModelType<T> => {
  if (process.env.NODE_ENV === 'development') {
    // make sure the model is always up to date in dev mode
    delete mongoose.models[collectionName];
  }

  return getModelForClass(model, {
    existingConnection: options?.connection,
    options: {
      ...options?.options,
      customName: collectionName,
    },
  });
}

export interface ModelOptions {
  connection?: mongoose.Connection;
  options?: {
    disableCaching?: boolean;
  };
}
