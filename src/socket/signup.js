import socket from './config.js';

export const on = {
    usernameAlreadyUsed: callback => {
        socket.on('usernameAlreadyUsed', message => callback(message));
    },

    userCreated: callback => {
        socket.on('userCreated', () => callback());
    }
}

export const emit = {
    signup: user => {
        socket.emit('signup', user);
    }
}