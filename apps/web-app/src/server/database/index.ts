import 'server-only';
import { Database } from '@zougui/gallery.database';

import { env } from '~/env';

export const DB = new Database(env.DATABASE_URL);

export type * from '@zougui/gallery.database';
