import crypto from 'node:crypto';


import sharp from 'sharp';
import blockhash from 'blockhash-core';

import { imageMimes } from './data';
import { type FileDownloadResult } from './types';

const HASH_BITS = 12;

const hashImage = async (file: FileDownloadResult): Promise<HashFileResult> => {
  const { data, info } = await sharp(file.path)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  const differencialHash = blockhash.bmvbhash({
    data,
    width: info.width,
    height: info.height,
    }, HASH_BITS);
  const uniqueHash = crypto.createHash('sha512').update(data).digest('hex');

  return {
    differencialHash,
    uniqueHash,
  };
}

export const hashFile = async (file: FileDownloadResult): Promise<HashFileResult> => {
  try {
    if (imageMimes.includes(file.mime)) {
      return await hashImage(file);
    }

    return {};
  } catch (error) {
    throw new Error('An error occured while hashing the content file', { cause: error });
  }
}

export interface HashFileResult {
  differencialHash?: string;
  uniqueHash?: string;
}
