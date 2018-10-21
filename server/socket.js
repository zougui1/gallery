const io = require('./config/')('socket');
require('./config/')('db');
const aws = require('./services/aws');
const mongoose = require('./services/mongoose');

io.on('connection', socket => {
    console.log('socket on');
    
    socket.on('uploadImage', image => {
        mongoose.setImage(image).then(img => socket.emit('retrieveImage', img));
    })
});