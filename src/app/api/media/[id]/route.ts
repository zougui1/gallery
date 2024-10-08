import path from 'node:path';

import fs from 'fs-extra';

import { env } from '~/env';

const handler = (req: Request) => {
  const [fileName] = req.url?.split('/').slice(-1) ?? [];

  if (!fileName) {
    throw new Error('No file name provided');
  }

  const filePath = path.join(env.CONTENT_DIR, fileName);
  const fileStream = fs.createReadStream(filePath);
  // @ts-expect-error Response handles NodeJS file stream but has no types for it
  const res = new Response(fileStream);
  res.headers.set('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);
  //res.headers.set('Content-Type', 'application/octet-stream');
  res.headers.set('Content-Type', 'image/png');

  // TODO handle error
  fileStream.on('error', (error) => {
    console.error('File Stream Error:', error);
  });

  return res;
}

export { handler as GET };
