const Event = require('events');
const mongoose = require('mongoose');
const requestLog = new Event();

mongoose.Query.prototype.log = function(callerName) {
  const modelName = this.model.modelName;
  const query = modelName === 'test' ? {} : this.getQuery();
  const additionalInfo = {
    modelName,
    functionName: callerName,
    query,
  }
  requestLog.emit('logSystem', additionalInfo);
  return this;
}

exports.requestLog = requestLog;
