const io = require('./config/')('socket');
const mongoose = require('./mongoose/index');
const { upload } = require('./services/cloudinary');

io.on('connection', socket => {
    console.log('socket on');

    socket.on('uploadImage', data => {
        let { img, imgB64, imageTemp64, text, draw } = data;

        img = img
            ? img
            : Buffer.from(imageTemp64.split(',')[1], 'base64');

        upload.withItsThumb(img, imgB64 || imageTemp64, draw, text)
            .then(images => {
                const dataToUpload = {
                    ...data,
                    ...images,
                };

                mongoose.setImage(dataToUpload)
                    .then(() => {
                        socket.emit('uploaded');
                    })
                    .catch(err => {
                        socket.emit('uploadError')
                        errorLogger(err);
                    });
            })
            .catch(err => {
                socket.emit('uploadError');
                errorLogger(err);
            });
    })

    socket.on('signup', user => {
        mongoose.signup(user)
        .then(() => socket.emit('userCreated'))
        .catch(() => {
            socket.emit('usernameAlreadyUsed', { usernameAlreadyUsed: 'This username is already used.' });
            errorLogger(err);
        });
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
        }).catch(() => {
            socket.emit('userNotFound', 'User not found.');
            errorLogger(err);
        });
    })

    socket.on('retrieveImagesByUser', req => { mongoose.getImagesByUser(req.username, req.page)
        .then(images => socket.emit('retrieveImagesFromDB', images))
        .catch(errorLogger)
    })

    socket.on('getImageById', id => { mongoose.getImageById(id)
        .then(image => socket.emit('getImageFromDB', image))
        .catch(errorLogger)
    })

    socket.on('createTag', tags => { mongoose.setTags(tags, mongoose.getAllTags())
        .then(() => console.log('tag created'))
        .catch(errorLogger)
    })

    socket.on('getAllTags', () => {mongoose.getAllTags()
        .then(tags => socket.emit('retrieveAllTagsFromDB', tags))
        .catch(errorLogger)
    })

    socket.on('getImagesByUserAndTags', req => {mongoose.getImagesByUserAndTags(req.username, req.tags, req.page)
        .then(images => socket.emit('retrieveImagesFromDB', images))
        .catch(errorLogger)
    })

    socket.on('getFinalPage', req => mongoose.getImagesCount(req.username, req.tags)
        .then(count => socket.emit('retrieveImagesCount', count))
        .catch(errorLogger)
    );

    socket.on('disconnect', () => console.log('disconnect'))
});
