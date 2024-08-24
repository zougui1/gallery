import { DB } from '../database';

process.on('message', (message) => {
  console.log('message:', message)
});
