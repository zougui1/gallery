const { upload } = require('./services/cloudinary');

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
                    console.log(err);
                    socket.emit('uploadError')
                    errorLogger(err);
                });
        })
        .catch(err => {
            socket.emit('uploadError');
            //console.log(err)
            errorLogger(err);
        });
})
