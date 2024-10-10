import { Connection, type ConnectionOptions } from 'rabbitmq-client';
import type zod from 'zod';

import { RabbitQueue, type RabbitQueueOptions } from './RabbitQueue';

export class RabbitMQ<T extends RabbitQueueOptionsShape | void = void> {
  readonly connection: Connection;
  readonly queue: RabbitQueueShape<T>;

  constructor(connectionOrOptions: Connection | ConnectionOptions, queue?: T) {
    this.connection = connectionOrOptions instanceof Connection
      ? connectionOrOptions
      : new Connection(connectionOrOptions);

    if (queue) {
      const queues: RabbitQueueShape<T> = {} as RabbitQueueShape<T>;

      for (const [name, options] of Object.entries(queue)) {
        // @ts-ignore
        queues[name] = this.createQueue(options);
      }

      this.queue = queues;
    } else {
      this.queue = undefined as unknown as RabbitQueueShape<T>;
    }
  }

  createQueue<T extends zod.ZodType>(options: RabbitQueueOptions<T>): RabbitQueue<T> {
    return new RabbitQueue(this.connection, options);
  }

  withQueues = <T extends RabbitQueueOptionsShape>(queues: T): RabbitMQ<T> => {
    return new RabbitMQ(this.connection, queues);
  }
}

export { type ConnectionOptions };

export type RabbitSchemaShape = Record<string, zod.ZodType>;

export type RabbitQueueShape<T extends RabbitQueueOptionsShape | void> = T extends RabbitQueueOptionsShape ? {
  [K in keyof T]: RabbitQueue<T[K]['schema']>;
} : never;

export type RabbitQueueOptionsShape = Record<string, RabbitQueueOptions<zod.ZodType>>;
