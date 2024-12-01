import path from 'node:path';

import workerpool from 'workerpool';

import { rabbit } from './rabbitmq';
//import { scraper } from './scraper';

const pool = workerpool.pool(path.join(__dirname, 'workerpool.js'));

rabbit.queue.galleryWorker.createConsumer({ qos: { prefetchCount: 1 } }, async message => {
  try {
    await pool.exec(message.body.type, [message.body]);
  } catch (error) {
    console.error('Worker error:', error);
  }
});
/*
scraper().catch(error => {
  console.error('Scraper error:', error);
});
*/
