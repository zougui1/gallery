import mongoose from 'mongoose';
import { type ReturnModelType } from '@typegoose/typegoose';
import type { Constructor } from 'type-fest';
export declare const getModel: <T extends Constructor<unknown>>(collectionName: string, model: T, options?: ModelOptions) => ReturnModelType<T>;
export interface ModelOptions {
    connection?: mongoose.Connection;
    options?: {
        disableCaching?: boolean;
    };
}
//# sourceMappingURL=getModel.d.ts.map