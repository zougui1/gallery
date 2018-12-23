const os = require('os-utils');
const { systemLogger, errorLogger } = require('./loggers');

const getSystemInfo = () => new Promise(resolve => {
  os.cpuUsage(cpuUsage => {
    let freeMem = Math.round(os.freemem());
    let totalMem = Math.round(os.totalmem());
    let usedMem = totalMem - freeMem;
    let usedMemPerc = Math.round(((usedMem * 100) / totalMem) * 100) / 100;
    freeMem += 'MB';
    usedMem += 'MB';
    usedMemPerc += '%';

    const memoryUsage = process.memoryUsage();
    const processMemory = {};
    for (const key in memoryUsage) {
        if (memoryUsage.hasOwnProperty(key)) {
            const memory = memoryUsage[key] / 1024 / 1024;
            const roundedMemory = Math.round(memory * 100) / 100;
            processMemory[key] = roundedMemory;
        }
    }
    const usedMemoryByServer = processMemory.heapUsed + processMemory.external;
    let usedMemoryByServerPerc = Math.round((usedMemoryByServer * 100) / totalMem * 100) / 100;
    usedMemoryByServerPerc += '%';

    let roundedCpuUsagePerc = Math.round(cpuUsage * 10000) / 10000;
    roundedCpuUsagePerc += '%';
    for (const key in processMemory) {
        if (processMemory.hasOwnProperty(key)) {
            processMemory[key] += 'MB';
        }
    }
    totalMem += 'MB';
    const systemInfo = {
        globalMemoryInfo: {
            freeMem,
            totalMem,
            usedMem,
            usedMemPerc,
        },
        appMemoryInfo: {
            ...processMemory,
            usedMemPerc: usedMemoryByServerPerc,
        },
        appCpuInfo: {
            cpuUsage: roundedCpuUsagePerc,
        },
    };
    resolve(systemInfo);
  });
});

setInterval(() => {
  getSystemInfo()
    .then(systemLogger)
    .catch(errorLogger);
}, 36000 * 60);

exports.getSystemInfo = getSystemInfo;
