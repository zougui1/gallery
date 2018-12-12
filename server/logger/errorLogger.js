const { readAndWrite } = require('./readAndWrite');

const errorLogger = error => {
  error = error || 'An error occured';
  readAndWrite('error', new Error(error));
}

exports.errorLogger = errorLogger;
global.errorLogger = errorLogger;
