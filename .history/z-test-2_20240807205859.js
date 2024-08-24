/* eslint-disable */
import path from 'node:path';

import { parallel } from 'radash';
import leven from 'fast-levenshtein';

import { hashImage } from './z-hashImage.js';

const dir = '/mnt/Manjaro_Data/zougui/Artworks/Zougui/NSFW/Multiple/';

const files = [
  {
    label: 'internal + cum',
    filePath: path.join(dir, 'Zougui_x_Marinus_messy.png'),
  },
  {
    label: 'no internal',
    filePath: path.join(dir, 'alts', 'zouXces_ext_clean.png'),
  },
  {
    label: 'no internal + cum',
    filePath: path.join(dir, 'alts', 'zouXces_ext_messy.png'),
  },
  {
    label: 'internal',
    filePath: path.join(dir, 'alts', 'zouXces_int_clean.png'),
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

  console.group(`hash distance compared to ${first.label}`);
  for (const file of others) {
    console.log(`${file.label}:`, leven.get(first.hash, file.hash));
  }
  console.groupEnd();
})();
