import path from 'node:path';

import fs from 'fs-extra';
import { mongo } from 'mongoose';
import { config } from 'dotenv';

config({ path: path.join(import.meta.dirname, '.env') });

const { DATABASE_URL, CONTENT_DIR } = process.env;

if (!DATABASE_URL) {
  console.error('Missing env variable DATABASE_URL');
  process.exit(1);
}

if (!CONTENT_DIR) {
  console.error('Missing env variable CONTENT_DIR');
  process.exit(1);
}

const mongoClient = new mongo.MongoClient(DATABASE_URL);
const db = mongoClient.db();

/**
 *
 * @param {String[]} files
 */
const removeFiles = async (files) => {
  const results = await Promise.allSettled(files.map(file => fs.remove(file)));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const errorMessage = result.reason instanceof Error
        ? result.reason.message
        : String(result.reason);

      console.log(`Could not remove file "${files[index]}": ${errorMessage}`);
    }
  });
}

const main = async () => {
  await mongoClient.connect();
  const collection = db.collection('posts');
  const dir = await fs.opendir(CONTENT_DIR);
  const unreferencedFiles = [];
  let i = 0;

  for await (const node of dir) {
    if (!node.isFile()) {
      continue;
    }

    console.log('file', ++i);

    const post = await collection.findOne({
      $or: [
        { 'file.fileName': node.name },
        { 'attachment.fileName': node.name },
        { 'thumbnail.original.fileName': node.name },
        { 'thumbnail.small.fileName': node.name },
      ],
    }, { projection: { _id: 1 } });

    if (!post) {
      unreferencedFiles.push(path.join(CONTENT_DIR, node.name));
    }
  }

  console.log(unreferencedFiles.length, 'unreferenced files');

  await Promise.allSettled([
    removeFiles(unreferencedFiles),
    mongoClient.close(),
  ]);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
