const aws = require('aws-sdk');
const { accessKeyId, secretAccessKey, bucket } = require('./api');
const s3 = new aws.S3({ accessKeyId, secretAccessKey });

module.exports = {s3, bucket};