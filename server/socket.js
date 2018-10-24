const io = require('./config/')('socket');
const aws = require('./services/aws');
const mongoose = require('./services/mongoose');

io.on('connection', socket => {
    console.log('socket on');
    
    socket.on('uploadImage', data => {
        mongoose.setImage(data).then(imageData => socket.emit('retrieveImage', imageData));
    })

    socket.on('signup', user => {
        mongoose.signup(user).then(console.log).catch(() => socket.emit('usernameAlreadyUsed', { usernameAlreadyUsed: 'This username is already used.' }));
    })

    socket.on('login', user => {
        mongoose.login(user).then(userInDB => {
            userInDB.comparePassword(user.password, (err, isMatch) => {
                let newUserObject = {
                    _id: userInDB._id,
                    username: userInDB.username
                };
                isMatch
                    ? socket.emit('logged', newUserObject)
                    : socket.emit('passwordIncorrect', 'The password is incorrect.');
            })
        }).catch(() => socket.emit('userNotFound', 'User not found.'));
    })
});