import socket from './config.js';

export const on = {
    retrieveAllTagsFromDB: callback => {
        //socket.on('retrieveImage', image => callback(image));
        socket.on('retrieveAllTagsFromDB', tags => callback(tags));
    }
}

export const emit = {
    getAllTags: data => {
        socket.emit('getAllTags');
    },

    createTags: tags => {
        socket.emit('createTag', tags);
    }
}