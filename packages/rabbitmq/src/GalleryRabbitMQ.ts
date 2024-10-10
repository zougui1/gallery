import { z } from 'zod';

import { getEnumValues } from '@zougui/gallery.utils';

import {
  RabbitMQ,
  type ConnectionOptions,
} from './utils';

export enum WorkerType {
  processPost = 'processPost',
}

export const createRabbitMQ = (options: ConnectionOptions) => {
  return new RabbitMQ(options).withQueues({
    galleryWorker: {
      name: 'gallery.worker',
      options: { durable: true },
      schema: z.object({
        type: z.enum(getEnumValues(WorkerType)),
        postQueueId: z.string(),
      }),
    },
  } as const);
}
