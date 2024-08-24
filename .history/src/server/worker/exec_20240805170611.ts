import path from 'node:path';
import { fork } from 'node:child_process';

const childProcess = fork(path.join(__dirname, 'process.js'));

childProcess.send({ test: 'value' })
