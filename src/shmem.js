const FFI = require('ffi-napi')
module.exports = (dllPath) => {
    let Library = new FFI.Library(dllPath + 'shmem.dll', {
        // 创建共享内存
        shmalloc: ['uchar *', ['uint64 *', 'string', 'uint64']],
        // 共享内存引用
        ref: ['uchar *', ['uint64 *', 'string']],
        // 共享内存释放
        unref: ['void', ['uint64 *', 'uchar *']],
        // 根据buffer获取指针 ['返回值,['buffer']]
        ptr2val: ['uint64', ['uchar *']],
        // 根据指针获取buffer ['返回值,['指针']]
        val2ptr: ['uchar *', ['uint64']],
        // gray转rgb
        gray2rgb: ['bool ', ['uchar *', 'uchar *', 'int', 'int']],
        // 切割图像  ['返回值',['原图像buffer','原图像宽','原图像高','切割起始点x','切割起始点y','切割图像buffer','新图像宽','新图像高','通道值']]
        crop: [
            'void',
            ['uchar *', 'int', 'int', 'int', 'int', 'uchar *', 'int', 'int', 'int'],
        ],
        // 粘贴图像  ['返回值',]'原图像buffer','原图像宽','原图像高','粘贴起始点x','粘贴起始点y','新图像宽','新图像宽','通道值']]
        paste: [
            'bool',
            ['uchar *', 'int', 'int', 'int', 'int', 'uchar *', 'int', 'int', 'int'],
        ],
        // 读取硬盘数据 ['返回值,['路径','buffer','宽','高','通道']]
        imread: ['bool', ['string', 'uchar *', 'int', 'int', 'int', 'bool']],
        // 写入硬盘数据同步 ['返回值,['路径','buffer','宽','高','通道']]
        imwrite: ['void', ['string', 'uchar *', 'int', 'int', 'int', 'bool']],
        // 写入硬盘数据异步 ['返回值,['路径','buffer','宽','高','通道']]
        imwrite_async: ['void', ['string', 'uchar *', 'int', 'int', 'int', 'bool']],
        // imwrite_async: ['void', ['string', 'uchar *', 'int', 'int', 'int', 'bool']],
        // 图像缩放 ['返回值,['原图的数据指针','原图的宽','原图的高','目标图的数据指针','目标图的宽','目标图的高','图像通道']]
        resize: ['void', ['char*', 'int', 'int', 'char*', 'int', 'int', 'int']],

    })
    return Library;
}
