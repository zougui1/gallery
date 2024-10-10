import { Publisher } from 'rabbitmq-client';
import type zod from 'zod';

export class RabbitPublisher<T extends zod.ZodType> {
  readonly #publisher: Publisher;
  readonly queue: string;
  readonly schema: T;

  constructor(publisher: Publisher, options: RabbitPublisherOptions<T>) {
    this.#publisher = publisher;
    this.schema = options.schema;
    this.queue = options.queue;
  }

  send = async (body: zod.infer<T>): Promise<void> => {
    const data = await this.schema.parseAsync(body);
    return await this.#publisher.send(this.queue, data);
  }
}

export interface RabbitPublisherOptions<T extends zod.ZodType> {
  queue: string;
  schema: T;
}
