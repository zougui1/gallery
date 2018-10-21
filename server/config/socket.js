const { http, port } = require('./server');
require('./global');


const io = require('socket.io')(http);
io.listen(port + 1);

module.exports = io;