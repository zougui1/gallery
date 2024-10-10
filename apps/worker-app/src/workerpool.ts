import workerpool from 'workerpool';

import { WorkerType } from '@zougui/gallery.rabbitmq';

import { processPost } from './process-post';

const worker = {
  processPost,
} satisfies Record<WorkerType, (data?: unknown) => void>;

workerpool.worker(worker);
