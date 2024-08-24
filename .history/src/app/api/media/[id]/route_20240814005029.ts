import path from 'node:path';
import fs from 'node:fs';

import { type NextRequest, type NextResponse } from 'next/server';

const handler = (req: NextRequest) => {
  const url = new URL(req.url);

  //url.

  console.log(req)
  const filePath = '/mnt/Dev/Code/javascript/temp-3/img/input/test22.jpg';
  const fileStream = fs.createReadStream(filePath);
  const res = new Response(fileStream);
  res.headers.set('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);
  res.headers.set('Content-Type', 'application/octet-stream');

  // TODO handle error
  fileStream.on('error', (error) => {
    console.error('File Stream Error:', error);
  });

  return res;
}

export { handler as GET };
