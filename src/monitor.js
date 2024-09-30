const os = require("os");
const { exec } = require('child_process');

// 获取CPU时间的快照
const getCpuTimes = () => {
  return os.cpus().map((cpu) => ({
    user: cpu.times.user,
    nice: cpu.times.nice,
    sys: cpu.times.sys,
    idle: cpu.times.idle,
    irq: cpu.times.irq,
  }));
};

// 计算单个CPU核心的使用情况
const calculateCpuUsage = (startTimes, endTimes) => {
  return endTimes.map((end, index) => {
    const start = startTimes[index];
    const totalStart = Object.values(start).reduce(
      (acc, time) => acc + time,
      0
    );
    const totalEnd = Object.values(end).reduce((acc, time) => acc + time, 0);
    const totalDiff = totalEnd - totalStart;

    const idleDiff = end.idle - start.idle;
    const usage = ((totalDiff - idleDiff) / totalDiff) * 100;

    return {
      cpuIndex: index,
      usage: usage.toFixed(2),
    };
  });
};

// 计算整体CPU使用情况
const calculateOverallCpuUsage = (startTimes, endTimes) => {
  let totalStart = { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 };
  let totalEnd = { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 };

  startTimes.forEach((start) => {
    totalStart.user += start.user;
    totalStart.nice += start.nice;
    totalStart.sys += start.sys;
    totalStart.idle += start.idle;
    totalStart.irq += start.irq;
  });

  endTimes.forEach((end) => {
    totalEnd.user += end.user;
    totalEnd.nice += end.nice;
    totalEnd.sys += end.sys;
    totalEnd.idle += end.idle;
    totalEnd.irq += end.irq;
  });

  const totalStartSum = Object.values(totalStart).reduce(
    (acc, time) => acc + time,
    0
  );
  const totalEndSum = Object.values(totalEnd).reduce(
    (acc, time) => acc + time,
    0
  );
  const totalDiff = totalEndSum - totalStartSum;

  const idleDiff = totalEnd.idle - totalStart.idle;
  const usage = ((totalDiff - idleDiff) / totalDiff) * 100;

  return usage.toFixed(2);
};

// 获取磁盘信息
function getDiskActivity() {
  return new Promise((resolve, reject) => {
    exec('wmic path Win32_PerfFormattedData_PerfDisk_LogicalDisk get Name,PercentDiskTime', (error, stdout, stderr) => {
      if (error) {
        reject(`exec error: ${error}`);
        return;
      }

      const lines = stdout.trim().split('\n');
      const dataLines = lines.slice(1).filter(line => line.trim() !== '');

      const result = dataLines.map(line => {
        const parts = line.trim().split(/\s+/);
        return {
          device: parts[0],
          percentDiskTime: parseFloat(parts[1])
        };
      });

      resolve(result);
    });
  });
}

function calculateDiskAverage(data, device) {
  let total = 0;
  let count = 0;
  data.forEach(entry => {
    entry.disks.forEach(disk => {
      if (disk.device === device) {
        total += disk.percentDiskTime;
        count++;
      }
    });
  });
  return total / count;
}

function getMes() {
  return new Promise(async (resolve, reject) => {

    //内存
    const freeMemory = os.freemem();
    const totalMemory = os.totalmem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercentage = (usedMemory / totalMemory) * 100;

    //磁盘
    const disks = await getDiskActivity()

    //cpu
    let startTimes = getCpuTimes();
    setTimeout(() => {
      
      const endTimes = getCpuTimes();
      const overallUsage = calculateOverallCpuUsage(startTimes, endTimes);
      
      console.log(`Overall CPU Usage: ${overallUsage}%`);
      console.log(`Memory Usage: ${memoryUsagePercentage.toFixed(2)}%`);
      console.log(`Disk Usage:`);
      disks.forEach(disk => {console.log(`device: ${disk.device} ${disk.percentDiskTime}`)})
      console.log('\n')
      startTimes = endTimes;
      resolve({ CPU: overallUsage, memory: memoryUsagePercentage.toFixed(2), disks: disks});
    }, 1000);
  });
}

async function getIPCMes() {
  const results = [];

  const interval = setInterval(async () => {
    try {
      const result = await getMes();
      results.push(result);
    } catch (err) {
      console.error(err);
    }
  }, 1000);

  // 捕捉进程退出事件
  process.on('SIGINT', () => {
    clearInterval(interval);

    const cpuAvg = results.reduce((sum, res) => sum + parseFloat(res.CPU), 0) / results.length;
    const memAvg = results.reduce((sum, res) => sum + parseFloat(res.memory), 0) / results.length;
    const devices = [...new Set(results.flatMap(entry => entry.disks.map(disk => disk.device)))];
    const diskAverages = {};

    devices.forEach(device => {
      diskAverages[device] = calculateDiskAverage(results, device);
    });
    console.log(`平均 CPU 使用率: ${cpuAvg.toFixed(2)}%`);
    console.log(`平均内存使用率: ${memAvg.toFixed(2)}%`);
    console.log(`磁盘平均使用率: `);
    devices.forEach(device => {
      console.log(`${device} ${diskAverages[device].toFixed(2)}%`);
    });
    process.exit();
  });
}
module.exports = {
  getIPCMes,
};



