const express = require('express');
const app = express();
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