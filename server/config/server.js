const express = require('express');
const app = express();
const fs = require('fs');
const os = require('os');
/*let options = {};

if(os.platform() === 'linux') {
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/zougui.fr/privkey.pem').toString();
    const certificate = fs.readFileSync('/etc/letsencrypt/live/zougui.fr/fullchain.pem').toString();
    const ca = fs.readFileSync('/etc/letsencrypt/live/zougui.fr/cert.pem').toString();
    options = {
        key: privateKey,
        cert: certificate,
        ca: ca,
    };
}*/

const http = require('http').Server(app);
require('./global');
const port = process.env.PORT || 8000;

app.listen(port);

module.exports = {
    http,
    express,
    app,
    port,
};
