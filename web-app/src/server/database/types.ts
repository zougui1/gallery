export type WithId<T extends Record<string, unknown>> = T & { _id: string };
