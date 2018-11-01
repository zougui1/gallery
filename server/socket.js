const io = require('./config/')('socket');
const mongoose = require('./mongoose/index');

io.on('connection', socket => {
    console.log('socket on');
    
    socket.on('uploadImage', data => {
        mongoose.setImage(data).then(imageData => socket.emit('retrieveImage', imageData));
    })

    socket.on('signup', user => {
        mongoose.signup(user)
        .then(() => socket.emit('userCreated'))
        .catch(() => socket.emit('usernameAlreadyUsed', { usernameAlreadyUsed: 'This username is already used.' }));
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

    socket.on('retrieveImagesByUser', req => { mongoose.getImagesByUser(req.username, req.page)
        .then(images => {socket.emit('retrieveImagesFromDB', images);console.log(images)})
        .catch(err => console.error(err))
    })

    socket.on('getImageById', id => { mongoose.getImageById(id)
        .then(image => socket.emit('getImageFromDB', image))
        .catch(err => console.log(err))
    })

    socket.on('createTag', tags => { mongoose.setTags(tags, mongoose.getAllTags())
        .then(tags => console.log('tag created'))
        .catch(console.log)
    })

    socket.on('getAllTags', () => {mongoose.getAllTags()
        .then(tags => socket.emit('retrieveAllTagsFromDB', tags))
        .catch(console.log)
    })

    socket.on('getImagesByUserAndTags', req => {mongoose.getImagesByUserAndTags(req.username, req.tags)
        .then(console.log)
        .catch(console.log)
    })
});