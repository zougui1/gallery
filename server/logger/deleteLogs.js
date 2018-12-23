const fs = require('fs');
const { expirationsDelay, errorLogger } = require('./loggers');

const deleteExpiredLogs = (logType, delay) => {
  const dirname = `${__dirname}/../../logs/${logType}`;
  fs.exists(dirname, exists => { if(!exists) return; })

  fs.readdir(dirname, (err, filenames) => {
    if(err) return errorLogger(err);

    const filesDate = filenames.map(filename => filename.split('.')[0]);
    const filesDateNumber = filesDate.map(fileDate => fileDate.split('-').map(number => Number(number)));
    const filesTotalDate = filesDateNumber.map(fileDateNumber => fileDateNumber.reduce((accu, current) => accu + current));

    const date = new Date;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const currentTotalDate = day + month + year;

    filenames.forEach((filename, i) => {
      if(currentTotalDate - filesTotalDate[i] >= delay) {
        const file = `${dirname}/${filename}`;
        fs.unlink(file, err => err && errorLogger(err));
      }
    });
  })
}

const deleteLogs = () => {
  for (const logType in expirationsDelay) {
    if (expirationsDelay.hasOwnProperty(logType)) {
      const expirationDelay = expirationsDelay[logType];
      deleteExpiredLogs(logType, expirationDelay);
    }
  }
}

setTimeout(deleteLogs, 36000 * 24);
deleteLogs();
