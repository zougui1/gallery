/* eslint-disable */
import path from 'node:path';

import { parallel } from 'radash';
import leven from 'fast-levenshtein';

import { hashImage } from './z-hashImage.js';

const dir = '/mnt/Manjaro_Data/zougui/Downloads';

const differentFile = path.join(dir, '1702854573.midnightrobin_on_cloud_nine.jpg');

const files = [
  {
    label: 'original',
    fileName: '1722882890.midnightrobin_boy_public.png',
  },
  {
    label: 'lingerie',
    fileName: '1722883063.midnightrobin_boytoy_public.png',
  },
  {
    label: 'lingerie + cum',
    fileName: '1722883281.midnightrobin_used_boytoy_public.png',
  },
  {
    label: 'lingerie + plug',
    fileName: '1722883408.midnightrobin_boytoy_alt_public.png',
  },
  {
    label: 'lingerie + cum + plug',
    fileName: '1722883553.midnightrobin_used_boytoy_alt_public.png',
  },
].map(f => ({ ...f, fileName: path.join(dir, f.fileName) }));

(async () => {
  const [original, ...others] = await parallel(files.length, files, async file => {
    return {
      ...file,
      hash: await hashImage(file.fileName),
    };
  });

  if (!original) {
    return;
  }

  console.time('leven')
  console.log('hash length:', original.hash.length);

  console.group('hash distance compared to original');
  for (const file of others) {
    console.log(`${file.label}:`, leven.get(original.hash, file.hash));
  }
  console.groupEnd();

  console.log();

  console.log('no cum: plug/no-plug', leven.get(others[0].hash, others[2].hash));
  console.log('cum: plug/no-plug', leven.get(others[1].hash, others[3].hash));
  console.timeEnd('leven')

  console.log('original/different-image', leven.get(original.hash, await hashImage(differentFile)));

  console.log('original/downscaled-original:', leven.get(original.hash, await hashImage(original.fileName, 875)))
})();
