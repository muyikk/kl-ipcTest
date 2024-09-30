// const LoadShmem = require(`./shmem`);
const LoadogCommon = require(`./ogCommon`);
const path = require('path');
const fs = require(`fs`)
const sizeOf = require('image-size');

// 检查是否在打包后的可执行文件中运行
const isPkg = typeof process.pkg !== 'undefined';
let rootDir, dllPath, readPath, writePath
if(isPkg) {
    rootDir = path.dirname(process.execPath)
    dllPath = rootDir + '\\';
    readPath = rootDir + '\\';
    writePath = rootDir + '\\writePath\\';
} else {
    dllPath = __dirname.replace(/src$/, 'dll\\');
    readPath = __dirname.replace(/src$/, 'pic\\');
    writePath = __dirname.replace(/src$/, 'writePath\\');

}

console.log("rootDir:", rootDir)
console.log("dllPath:", dllPath)
console.log("readPath:", readPath)
fs.existsSync(writePath) ? null : fs.mkdirSync(writePath)

//todo 离谱操作，不加后面这三行就会报126
let pathArray = process.env.PATH.split(';');
pathArray.unshift(dllPath);
process.env.PATH = pathArray.join(';');

let ogCommon = LoadogCommon(dllPath);
// let shmem = LoadShmem(dllPath);

//todo 把Async封装
// const libs = {  ogCommon };
const libs = { ogCommon };
for (const lib in libs) {
    const item = libs[lib];
    for (const method in item) {
        item[method + 'Async'] = (...args) => {
            return new Promise((resolve, reject) => {
                item[method].async(...args, (err, value) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(value);
                });
            });
        };
    }
    this[lib] = item;
}

let width
let height
let channel = 3
let imgBuffer

pathFiles = fs.readdirSync(readPath)
const imageExtensions = ['.jpg', '.jpeg', '.png','.bmp']; // 常见图片文件扩展名
const imageFiles = pathFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
});

sizeOf(readPath + imageFiles[0], (err, dimensions) => {
    if (err) {
      console.error('获取图片信息时出错:', err);
      return;
    }
    width = dimensions.width
    height = dimensions.height
    console.log('图片：', imageFiles[0])
    console.log('宽度:', width);
    console.log('高度:', height);
    
    imgBuffer = Buffer.alloc(width * height * channel)
    // this.shmem.imread(readPath + imageFiles[0], imgBuffer, width, height, channel, true)
    this.ogCommon.imread(readPath + imageFiles[0], imgBuffer, height, width, channel, true)
  });
// writePictures(14, 500, true)

/**
 * 
 * @param {number} times 写图数量
 * @param {number} setTime 间隔时间
 * @param {boolean} isDelete 是否删图
 */
 function writePictures(times, setTime, isDelete) {
    setInterval(() => {
        let i = 0
        do {
            ogCommon.imwrite_asyncAsync(
                `${writePath}${Date.now()}-${i++}.jpg`,
                imgBuffer,
                height,
                width,
                channel,
                true,
            )
        }while(i < times)
        // console.log(Date.now())
    }, setTime);
    setInterval(() => {//10s删一次
        if(isDelete) {
            fs.readdir(writePath, (err, res) => {
                res.sort()
                res.slice(0, 10000/setTime*times-2).forEach(picPath => {
                    fs.rmSync(`${writePath}${picPath}`)
                    
                });
            })
        }
    }, 10000);
}

module.exports = {
    writePictures
};