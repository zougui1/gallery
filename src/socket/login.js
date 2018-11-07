import socket from './config.js';

export const on = {
    logged: callback => socket.on('logged', user => callback()),
    passwordIncorrect: callback => socket.on('passwordIncorrect', message => callback(message)),
    userNotFound: callback => socket.on('userNotFound', message => callback(message)),
}

export const emit = {
    login: user => socket.emit('login', user),
}