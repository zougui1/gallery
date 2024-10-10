import path from 'node:path';
import { Readable } from 'node:stream';

import fs from 'fs-extra';
import axios from 'axios';

import { FileTypeResult } from './types';

export const downloadFile = async (url: string, output: string): Promise<FileTypeResult> => {
  const { fileTypeFromFile } = await import('file-type');
  await fs.ensureDir(path.dirname(output));

  const response = await axios.get(url, {
    responseType: 'stream',
  });

  // this should not happen, just for type safety
  if (!(response.data instanceof Readable)) {
    throw new Error('Cannot read the file');
  }

  const writeStream = fs.createWriteStream(output);

  response.data.pipe(writeStream);

  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  const fileType = await fileTypeFromFile(output);

  if (!fileType) {
    if (url.endsWith('.txt')) {
      return {
        ext: 'txt',
        mime: 'text/plain',
      };
    }

    throw new Error(`Unknown file type: ${url}`);
  }

  return fileType;
}
