import 'server-only';

import mongoose from 'mongoose';

import { env } from '~/env';

void mongoose.connect(env.DATABASE_URL);
mongoose.set('strictQuery', true);
