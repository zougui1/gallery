const { readAndWrite } = require('./readAndWrite');
const { getSystemInfo } = require('./system');

const errorLogger = error => {
  error = error || 'An error occured';
  readAndWrite('error', new Error(error));
}

const systemLogger = (systemInfo, additionalInfo) => readAndWrite('system', systemInfo, additionalInfo);
const logSystemInfo = additionalInfo => getSystemInfo()
  .then(systemInfo => {
    additionalInfo.numberOfUsers = numberOfUsers;
    systemLogger(systemInfo, additionalInfo);
  })
  .catch(errorLogger);


const expirationsDelay = {
  error: 7,
  system: 5,
};

const loggers = {
  systemLogger,
  errorLogger,
  logSystemInfo,
  expirationsDelay,
}

module.exports = loggers;

for (const key in loggers) {
  if (loggers.hasOwnProperty(key)) {
    const logger = loggers[key];
    global[key] = logger;
  }
}
