import path from 'node:path';

import fs from 'fs-extra';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { env } from '~/env';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const [fileName] = req.url?.split('/').slice(-1) ?? [];

  if (!fileName) {
    throw new Error('No file name provided');
  }

  console.log(res)

  const filePath = path.join(env.CONTENT_DIR, fileName);
  const fileStream = await fs.readFile(filePath);

  res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);
  //res.headers.set('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Type', 'image/png');

  return res.status(200).send(fileStream);
}

const handler_old = (req: NextApiRequest) => {
  const [fileName] = req.url?.split('/').slice(-1) ?? [];

  if (!fileName) {
    throw new Error('No file name provided');
  }

  const filePath = path.join(env.CONTENT_DIR, fileName);
  const fileStream = fs.createReadStream(filePath);
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
