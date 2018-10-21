const server = require('./server');
const db = require('./db');
const cache = require('./cache');
const socket = require('./socket');
const api = require('./api');
const aws = require('./aws');
require('./global');
process.env['DEBUG'] = 'myapp:server';
const debug = require('debug')('Gallery:config');
const configs = [
    'server',
    'db',
    'cache',
    'socket'
];

module.exports = configName => {
    switch (configName) {
        case 'server':
            return server;
            break;
        case 'db':
            return db;
            break;
        case 'cache':
            return cache;
            break;
        case 'socket':
            return socket;
            break;
        case 'api':
            return api;
            break;
        case 'aws':
            return aws;
            break;
    
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