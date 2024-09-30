const FFI = require('ffi-napi')
module.exports = (dllPath) => {
  let anomaly = new FFI.Library(dllPath + 'anomaly', {
     // 初始化引擎，是否成功:[目录，图片数量，图片通道，图片高，图片宽，特征维度]
     initEngine: ['bool', ['string', 'int', 'int', 'int', 'int', 'int']],
     // 关闭引擎
     destroyEngine: ['bool', []],
     // 图片检测；是否成功:[图片名,db名称，图片buffer指针,模板buffer指针,高,宽,通道，最大检测数量,阈值,跳过检测的缺陷id数组,跳过检测的id数组大小,检测结果]
     // 跳过检测的缺陷id数组，**正常编号需要放在头部**
     anomalyDetect: [
       'bool',
       [
         'string',
         'string',
         'uchar *',
         'uchar *',
         'int',
         'int',
         'int',
         'int',
         'float',
         'int *',
         'int',
         'float *',
       ],
     ],
     // 提取特征；是否成功:[图片buffer, 高， 宽， 通道， 特征]
     featureExtract: ['bool', ['uchar *', 'int', 'int', 'int', 'float *']],
     // 删除数据；earse后的db总条数:[db名称, 数量, id列表]
     erase: ['int', ['string', 'int', 'int *']],
       // 按缺陷id，删除db中的一条特征:[db名称, 删除的特征所对应的缺陷id]
     erase_one: ['int', ['string', 'int', ]],
     // 根据缺陷类型删除db数据；earse后的db总条数:[db名称, 缺陷类型]
     erase_type: ['int', ['string', 'int']],
     // 加载数据集，没有的话会自动创建；返回db总条数:[db名称]
     load_DB: ['int', ['string']],
     // 释放数据集:[db名称]
     release_DB: ['bool', ['string']],
     // 提取全图+mask特征，学习coreset；特征总条数:[db, 图片buffer,mask图片buffer, 图片高, 图片宽, 通道, db对应pattern的正常defectId, 最大数，相似度threshold, 特征结果数组 ]
     coreLearn: [
       'int',
       [
         'string',
         'uchar *',
         'uchar *',
         'int',
         'int',
         'int',
         'int',
         'int',
         'float',
         'float *',
       ],
     ],
     // 插入数据；db总条数:[db名称, 插入的总数量，id列表，type列表，feature列表]
     insert: ['int', ['string', 'int', 'int *', 'int *', 'float *']],
     // 向db插入一条特征；db总条数:[db名称, 插入的特征对应的缺陷id，插入的特征对应的缺陷类型，插入的特征]
     insert_one: ['int', ['string', 'int', 'int *', 'int *', 'float *']],
     // 更新数据；是否成功:[db名称，id，type，feature可为空]
     update_one: ['int', ['string', 'int', 'int', 'float *']],
     // 批量更新数据；是否成功:[db名称, 总数，id，type，feature可为空]
     update: ['int', ['string', 'int', 'int *', 'int *', 'float *']],
      // 批量更新数据；是否成功:[db名称, 总数，id，type，feature可为空]
     query: ['bool', ['string', 'int', 'float *', 'float *', 'int *', 'int *']],
     // 回调函数
     setCallback: ['bool', ['pointer']],
    
  })
  anomaly['addDetectListener'] = (cb) => {
    const callback = Callback(
      'void',
      //缺陷检测结果 [anomalyDetect的图片名, ?, 缺陷总数, 缺陷结果指针]
      ['string', 'bool', 'int', 'float *'],
      (...args) => {
        cb(args[0], args[2], args[3]);
      },
    );
    // 防止callback函数被回收
    process.on('exit', function (exit) {
      console.log(exit);
      callback;
    });
    anomaly.setCallback(callback);
    return cb;
  };
  return anomaly;
}
