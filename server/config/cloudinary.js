const cloudinary = require('cloudinary');
const { cloud_name, api_key, api_secret } = require('./api');

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

module.exports = cloudinary;
