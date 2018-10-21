import socket from './config.js';

export const on = {
    retrieveImage: callback => {
        socket.on('retrieveImage', image => callback(image));
    }
}

export const emit = {
    uploadImage: image => {
        socket.emit('uploadImage', image);
    },
}