import socket from './config.js';

export const on = {
    retrieveAllTagsFromDB: callback => socket.on('retrieveAllTagsFromDB', tags => callback(tags)),
}

export const emit = {
    getAllTags: data => socket.emit('getAllTags'),
    createTags: tags => socket.emit('createTag', tags),
}