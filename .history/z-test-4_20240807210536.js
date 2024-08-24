/* eslint-disable */
import path from 'node:path';

import { parallel } from 'radash';
import leven from 'fast-levenshtein';

import { hashImage } from './z-hashImage.js';

const dir = '/mnt/Manjaro_Data/zougui/Artworks/Zougui/NSFW/Multiple/';

const files = [
  {
    label: 'original',
    filePath: path.join(dir, 'Magic Forest clean.png'),
  },
  {
    label: 'cum',
    filePath: path.join(dir, 'Magic Forest messy.png'),
  },
  {
    label: 'internal + cum',
    filePath: path.join(dir, 'Magic Forest messy close up.png'),
  },
];

(async () => {
  const [first, ...others] = await parallel(files.length, files, async file => {
    return {
      ...file,
      hash: await hashImage(file.filePath),
    };
  });

  if (!first) {
    return;
  }

  console.log('hash length:', first.hash.length);
  //console.log(first.hash)

  console.group(`hash distance compared to ${first.label}`);
  for (const file of others) {
    console.log(`${file.label}:`, leven.get(first.hash, file.hash));
    //console.log(file.hash)
  }
  console.groupEnd();
})();
