import path  from 'node:path';

import sharp  from 'sharp';
import blockhash  from 'blockhash-core';
import { parallel } from 'radash';
import leven from 'fast-levenshtein';

const dir = '/mnt/Manjaro_Data/zougui/Downloads';

const files = [
  '1722882890.midnightrobin_boy_public.png',
  '1722883063.midnightrobin_boytoy_public.png',
  '1722883281.midnightrobin_used_boytoy_public.png',
  '1722883408.midnightrobin_boytoy_alt_public.png',
  '1722883553.midnightrobin_used_boytoy_alt_public.png',
].map(f => path.join(dir, f));

const hashImage = async (filePath) => {
  const { data, info } = await sharp(filePath)
  .raw()
  .ensureAlpha()
  .toBuffer({ resolveWithObject: true });

  return blockhash.bmvbhash({
    data,
    width: info.width,
    height: info.height,
  }, 64 / 4);
}

(async () => {
  const [first, ...others] = await parallel(files.length, files, async file => {
    return await hashImage(file);
  });

  console.log(first);

  for (const hash of others) {
    console.log(hash, leven.get(first, hash));
  }
  console.log(leven.get(others[1], others[3]));
})();
