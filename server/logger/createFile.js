const fs = require('fs');
const chalk = require('chalk');
const { getPreviousDir } = require('./utils');
const { createFolder } = require('./createFolder');

const defaultDataFile = `{
  "data": []
}`;

const createFile = logType => {
  const date = new Date;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedDate = `${day}-${month}-${year}`;
  const file = `${__dirname}/../../logs/${logType}/${formattedDate}.json`;

  const previousDir = getPreviousDir(file);

  return new Promise((resolve, reject) => {
    fs.exists(previousDir, exists => {
      if(!exists) {
        createFolder(logType, previousDir)
          .then(() => {
            openAndWrite(file)
              .then(resolve)
              .catch(console.log);
          })
          .catch(reject);
      } else openAndWrite(file);
    })
  })
}

const openAndWrite = path => new Promise((resolve, reject) => {
  fs.open(path, 'wx', (err, fd) => {
    if (err) reject(err);
    else {
      const formattedPath = path.replace(/\\/g, '/');
      console.log(chalk.rgb(14, 220, 65)(`The file "${formattedPath}" has been successfully created.`));
      fs.writeFile(path, defaultDataFile, 'utf-8', err => {
        if (err) reject(err);
        else resolve();
      });
    }
  });
});

exports.createFile = createFile;
