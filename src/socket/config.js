import openSocket from 'socket.io-client';

let url;

if (/localhost/.test(window.location)) url = 'http://localhost:8001';
else url = 'http://zougui.fr:8001';

const socket = openSocket(url);

export default socket;