/* eslint-disable */
import path from 'node:path';

import { parallel } from 'radash';
import leven from 'fast-levenshtein';

import { hashImage } from './z-hashImage.js';

const dir = '/mnt/Manjaro_Data/zougui/Artworks/Zougui/NSFW/Body parts/';

const files = [
  {
    label: 'original',
    filePath: path.join(dir, 'Muzzled_Zougui.png'),
  },
  {
    label: 'gagged',
    filePath: path.join(dir, 'Muzzled_and_gagged_Zougui.png'),
  },
  {
    label: 'baguetted',
    filePath: path.join(dir, 'Muzzled_Zougui_with_baguette_squinting.png'),
  },
  {
    label: 'gagged + blindfolded',
    filePath: path.join(dir, 'Muzzled_gagged_and_blinfolded_Zougui.png'),
  },
  {
    label: 'latex',
    filePath: path.join(dir, 'Muzzled_Zougui_latex.png'),
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
