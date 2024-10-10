import {
  type Connection,
  type ConsumerProps,
  type PublisherProps,
  type MessageBody,
} from 'rabbitmq-client';
import type zod from 'zod';

import { RabbitPublisher } from './RabbitPublisher';

export class RabbitQueue<T extends zod.ZodType> {
  readonly connection: Connection;
  readonly name: string;
  readonly schema: T;
  readonly options?: ConsumerProps['queueOptions'];
  readonly bindings?: ConsumerProps['queueBindings'];

  constructor(connection: Connection, options: RabbitQueueOptions<T>) {
    this.connection = connection;
    this.name = options.name;
    this.schema = options.schema;
    this.options = options.options;
    this.bindings = options.bindings;
  }

  createConsumer = (options: ConsumerOptions, callback: (message: RabbitMessageBody<T>) => (void | Promise<void>)) => {
    return this.connection.createConsumer({
      ...options,
      queue: this.name,
      queueOptions: this.options,
      queueBindings: this.bindings,
    }, async (message) => {
      const result = await this.schema.safeParseAsync(message.body);

      if (!result.success) {
        return console.error(result.error);
      }

      await callback({
        ...message,
        body: result.data,
      });
    });
  }

  createPublisher = (options?: PublisherProps): RabbitPublisher<T> => {
    const publisher = this.connection.createPublisher(options);
    return new RabbitPublisher(publisher, {
      schema: this.schema,
      queue: this.name,
    });
  }
}

export interface RabbitQueueOptions<T extends zod.ZodType> {
  name: string;
  options?: ConsumerProps['queueOptions'];
  bindings?: ConsumerProps['queueBindings'];
  schema: T;
}

export interface ConsumerOptions extends Omit<ConsumerProps, 'queue' | 'queueOptions' | 'queueBindings'> {

}

export interface RabbitMessageBody<T extends zod.ZodType> extends Omit<MessageBody, 'body'> {
  body: zod.infer<T>;
}
