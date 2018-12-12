const cloudinary = require('../config')('cloudinary');
const sharp = require('sharp');
const Base64 = require('@ronomon/base64');

const upload = {
  withItsThumb: (img, imgB64, draw, text) => {
    return new Promise((resolve, reject) => {
      let imageNeeded = 2;
      if(draw) ++imageNeeded;
      if(text) ++imageNeeded;

      const imageStore = tempImageStore(imageNeeded);
      upload.direct(imgB64)
        .then(imageData => {
          imageStore.addImage('image', imageData.secure_url);
          if(imageStore.hasEnoughImages()) resolve(imageStore.getImages());
        })
        .catch(reject)

      optimize(img)
        .then(thumbBuffer => {
          const encodedBuffer = Base64.encode(thumbBuffer);
          const b64 = encodedBuffer.toString('ascii');
          upload.direct(`data:image/webp;base64,${b64}`)
            .then(imageData => {
              imageStore.addImage('thumb', imageData.secure_url);
              if(imageStore.hasEnoughImages()) resolve(imageStore.getImages());
            })
            .catch(reject)
        })
        .catch(reject)

      if(draw) {
        upload.direct(draw)
          .then(imageData => {
            imageStore.addImage('draw', imageData.secure_url);
            if(imageStore.hasEnoughImages()) resolve(imageStore.getImages());
          })
          .catch(reject)
      }

      if(text) {
        upload.direct(text)
          .then(imageData => {
            imageStore.addImage('text', imageData.secure_url);
            if(imageStore.hasEnoughImages()) resolve(imageStore.getImages());
          })
          .catch(reject)
      }
    })
  },

  simple: img => new Promise((resolve, reject) => {
    upload.direct(img)
      .then(imageData => resolve({ image: imageData.secure_url }))
      .catch(reject);
  }),

  direct: image => cloudinary.v2.uploader.upload(image, { folder: 'dorg-gallery/' }),
}

const optimize = file => sharp(file)
  .resize({ height: 150 })
  .webp({ quality: 50 })
  .toBuffer()

const tempImageStore = imageNeeded => {
  let i = 0;
  let images = {};
  return {
    addImage: (type, image) => {
      images[type] = image;
      ++i;
    },
    hasEnoughImages: () => i === imageNeeded,
    getImages: () => images,
  };
}

exports.upload = upload;
