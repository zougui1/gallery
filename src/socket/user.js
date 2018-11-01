import socket from './config.js';

export const on = {
    retrieveImagesFromDB: callback => {
        //socket.on('retrieveImage', image => callback(image));
        socket.on('retrieveImagesFromDB', image => callback(image));
    },

    getImageFromDB: callback => {
        socket.on('getImageFromDB', image => callback(image));
    },
}

export const emit = {
    retrieveImagesByUser: req => {
        socket.emit('retrieveImagesByUser', req);
    },

    getImageById: id => {
        socket.emit('getImageById', id);
    },

    getImagesByUserAndTags: req => {
        socket.emit('getImagesByUserAndTags', req);
    }
}