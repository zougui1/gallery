const redis = require('redis');
const redisUrl = 'redis://localhost:6379';
const util = require('util');
const client = redis.createClient(redisUrl);
require('./global');

client.hget = util.promisify(client.hget);
client.get = util.promisify(client.get);