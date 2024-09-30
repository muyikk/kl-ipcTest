const Write = require('./src/writePic.js')
const Monitor = require('./src/monitor.js')

let writeNum;
let writeTime;
let isDelete;
const args = process.argv.slice(2);

if (args.length > 0) {
  writeNum = args[0];
  writeTime = args[1];
  isDelete = args[2];
} else {
  console.error('未提供参数:\t写图数量\t间隔时间\t是否删图');

}

Write.writePictures(writeNum, writeTime, isDelete)
Monitor.getIPCMes()