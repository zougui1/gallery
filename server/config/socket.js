const { http, port } = require('./server');
const io = require('socket.io')(http);
require('./global');
io.listen(port + 1, console.log);

module.exports = io;
