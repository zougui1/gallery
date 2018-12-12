import socket from './config.js';

export const on = {
    retrieveImage: callback => socket.on('retrieveImage', image => callback(image)),
    retrieveAllTagsFromDB: callback => socket.on('retrieveAllTagsFromDB', tags => callback(tags)),
    compressedImage: callback => socket.on('compressedImage', image => callback(image)),
    uploaded: callback => socket.on('uploaded', callback),
    uploadError: callback => socket.on('uploadError', callback),
}

export const emit = {
    uploadImage: data => socket.emit('uploadImage', data),
    getAllTags: data => socket.emit('getAllTags'),
    createTags: tags => socket.emit('createTag', tags),
    sendImageToServer: data => socket.emit('sendImageToServer', data),
}
