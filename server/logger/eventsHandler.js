const { requestLog } = require('../services/logging');
const { logSystemInfo } = require('./loggers');

requestLog.on('logSystem', additionalInfo => {
  logSystemInfo(additionalInfo)
})
