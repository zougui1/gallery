/* eslint-disable */
import path from 'node:path';

import { parallel } from 'radash';
import leven from 'fast-levenshtein';

import { hashImage } from './z-hashImage.js';

const dir = '/mnt/Manjaro_Data/zougui/Artworks/Zougui/NSFW/Body parts/glory hole/';

const files = [
  {
    label: 'female',
    filePath: path.join(dir, 'female Zougui.png'),
  },
  {
    label: 'male + hard',
    filePath: path.join(dir, 'hard male Zougui.png'),
  },
  {
    label: 'male',
    filePath: path.join(dir, 'male Zougui.png'),
  },
  {
    label: 'female + cum',
    filePath: path.join(dir, 'messy female Zougui.png'),
  },
  {
    label: 'male + hard + cum',
    filePath: path.join(dir, 'messy hard male Zougui.png'),
  },
  {
    label: 'male + cum',
    filePath: path.join(dir, 'messy male Zougui.png'),
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
