import sharp  from 'sharp';
import blockhash  from 'blockhash-core';

/**
 *
 * @param {String} filePath
 * @param {Number} [width]
 * @returns
 */
export const hashImage = async (filePath, width) => {
  let sharpener = sharp(filePath)

  if (width) {
    sharpener = sharpener.resize({ width });
  }

  const { data, info } = await sharpener
  .raw()
  .ensureAlpha()
  .toBuffer({ resolveWithObject: true });

  return blockhash.bmvbhash({
    data,
    width: info.width,
    height: info.height,
  }, 12);
}
