import path from 'node:path';
import { fork } from 'node:child_process';

//export const exec = () => {
  const childProcess = fork(path.join(__dirname, 'process.worker.js'));
  childProcess.send({ test: 'value' })
//}
