/* eslint-disable */
import path from 'node:path';

import { parallel } from 'radash';
import leven from 'fast-levenshtein';

import { hashImage } from './z-hashImage.js';

const dir = '/mnt/Manjaro_Data/zougui/Downloads/';

const files = [
  {
    label: 'original',
    filePath: path.join(dir, '1665415428.syrazor_neroeternity_syrazor_kroxigor_missionary.png'),
  },
  {
    label: 'cum',
    filePath: path.join(dir, '1665415506.syrazor_neroeternity_syrazor_kroxigor_missionary_cum.png'),
  },
  {
    label: 'internal',
    filePath: path.join(dir, '1665415571.syrazor_neroeternity_syrazor_kroxigor_missionary_extras.png'),
  },
  {
    label: 'internal + cum',
    filePath: path.join(dir, '1665415628.syrazor_neroeternity_syrazor_kroxigor_missionary_extras_cum.png'),
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
