const server = require('./server');
const db = require('./db');
const cache = require('./cache');
const socket = require('./socket');
const api = require('./api');
const cloudinary = require('./cloudinary');
require('./global');
process.env['DEBUG'] = 'myapp:server';
const debug = require('debug')('Gallery:config');
const configs = [
    'server',
    'db',
    'cache',
    'socket',
    'cloudinary',
];

module.exports = configName => {
    switch (configName) {
        case 'server': return server;
        case 'db': return db;
        case 'cache': return cache;
        case 'socket': return socket;
        case 'api': return api;
        case 'cloudinary': return cloudinary;

        default:
            console.error(`Config name error, config called: "${configName}".`.red);
            console.log('Available configs:'.cyan);
            configs.forEach(config => {
                console.log(`   ${config}`.cyan);
            });
            process.exit(1);
            break;
    }
}
