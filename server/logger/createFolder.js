const fs = require('fs');
const chalk = require('chalk');
const { getPreviousDir } = require('./utils');

let createFolder = (folderName, path) => {
  const doesExist = `${__dirname}/../..`;
  const maybeDontExist = `logs/${folderName}`;
  path = path || `${doesExist}/${maybeDontExist}`;

  const previousDir = getPreviousDir(path);

  return new Promise((resolve, reject) => {
    fs.exists(previousDir, exists => {
      if(!exists) {
        createFolder(folderName, previousDir)
          .then(mkdir(path)
              .then(resolve)
              .catch(reject))
          .catch(reject);
      } else mkdir(path).then().catch();
    })
  })
}

const mkdir = path => new Promise((resolve, reject) => {
  fs.mkdir(path, err => {
    if (err) reject(err);
    else {
      const formattedPath = path.replace(/\\/g, '/');
      console.log(chalk.rgb(14, 220, 65)(`The folder "${formattedPath}" has been successfully created.`));
      resolve();
    }
  })
})

exports.createFolder = createFolder;
