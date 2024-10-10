import path from 'node:path';

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
  path: path.join(__dirname, '../.env'),
});

const schema = z.object({
  DATABASE_URL: z.string().url(),

  FURAFFINITY_COOKIE_A: z.string(),
  FURAFFINITY_COOKIE_B: z.string(),

  CONTENT_DIR: z.string(),
  TEMP_DIR: z.string(),

  RABBIT_MQ_USERNAME: z.string(),
  RABBIT_MQ_PASSWORD: z.string(),
  RABBIT_MQ_HOSTNAME: z.string().ip(),
  RABBIT_MQ_PORT: z.coerce.number().int(),
});

const result = schema.safeParse(process.env);

if (!result.success) {
  throw new Error('Invalid environment variables', { cause: result.error });
}

export const env = result.data;
