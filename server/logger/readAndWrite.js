const fs = require('fs');
const chalk = require('chalk');
const { createFile } = require('./createFile');


const readAndWrite = (logType, data) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const formattedDate = `${day}-${month}-${year}`;
  const formattedTime = `${hour}:${min}:${sec}`;

  const newData = {
    date: formattedDate,
    time: formattedTime,
  };

  if(logType === 'error') {
    newData.error = {};
    newData.error.message = data.stack;
    newData.error.code = data.code;
  } else {
    newData.data = data;
  }

  const file = `${__dirname}/../../logs/${logType}/${formattedDate}.json`;
  fs.exists(file, exists => {
    if(!exists) createFile(logType, file)
      .then(() => readAndWriteFile(file, newData))
      .catch(console.log)
    else readAndWriteFile(file, newData);
  })

}

const readAndWriteFile = (path, data) => {
  fs.readFile(path, 'utf-8', (err, fileData) => {
    if (err) throw err;

    let parsedFile = JSON.parse(fileData);
    parsedFile.data.push(data);
    const json = JSON.stringify(parsedFile, '', ' ');

    fs.writeFile(path, json, 'utf-8', err => {
      if (err) throw err;
    });

  });
}

exports.readAndWrite = readAndWrite;
