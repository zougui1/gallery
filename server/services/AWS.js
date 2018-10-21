const {s3, bucket} = require('../config/')('aws');
const uuid = require('uuid/v1');
const util = require('util');
s3.getSignedUrl = util.promisify(s3.getSignedUrl);

exports.getSignedUrl = data => {
    // TODO get the userId 
    const userId = 'r4b1e8h485er74g8ezr4h85';
    const contentType = data.type;
    const ext = contentType.split('/')[1];
    const key = `${userId}/${uuid()}.${ext}`;

    return s3.getSignedUrl('putObject', {
        Bucket: bucket,
        ContentType: contentType,
        Key: key
    });
}