import socket from './config.js';
socket.on('retrieveImage', image => console.log(image));
export const on = {
    retrieveImage: callback => {
        //socket.on('retrieveImage', image => callback(image));
        socket.on('retrieveImage', image => console.log(image));
    }
}

export const emit = {
    uploadImage: data => {
        socket.emit('uploadImage', data);
    },
}