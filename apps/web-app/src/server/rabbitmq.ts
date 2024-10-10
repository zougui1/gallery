import { createRabbitMQ } from '@zougui/gallery.rabbitmq';

import { env } from '../env';

const client = createRabbitMQ({
  username: env.RABBIT_MQ_USERNAME,
  password: env.RABBIT_MQ_PASSWORD,
  hostname: env.RABBIT_MQ_HOSTNAME,
  port: env.RABBIT_MQ_PORT,
});

export const rabbit = {
  galleryWorker: client.queue.galleryWorker.createPublisher(),
};
