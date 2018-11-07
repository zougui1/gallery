import socket from './config.js';

export const on = {
    retrieveImage: callback => socket.on('retrieveImage', image => callback(image)),
    retrieveAllTagsFromDB: callback => socket.on('retrieveAllTagsFromDB', tags => callback(tags)),
}

export const emit = {
    uploadImage: data => {socket.emit('uploadImage', data);console.log('setImage socket emit')},
    getAllTags: data => socket.emit('getAllTags'),
    createTags: tags => socket.emit('createTag', tags),
}