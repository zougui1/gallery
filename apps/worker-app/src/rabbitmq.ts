import { createRabbitMQ } from '@zougui/gallery.rabbitmq';

import { env } from './env';

export const rabbit = createRabbitMQ({
  username: env.RABBIT_MQ_USERNAME,
  password: env.RABBIT_MQ_PASSWORD,
  hostname: env.RABBIT_MQ_HOSTNAME,
  port: env.RABBIT_MQ_PORT,
});

rabbit.connection.on('error', error => {
  console.log('RabbitMQ connection error:', error);
});

rabbit.connection.on('connection', () => {
  console.log('RabbitMQ connected');
});

// Clean up when receiving a shutdown signal
const onShutdown = async () => {
  await rabbit.connection.close()
}

process.on('SIGINT', onShutdown)
process.on('SIGTERM', onShutdown)
