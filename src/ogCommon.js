const FFI = require('ffi-napi')
module.exports = (dllPath) => {
  let Library = new FFI.Library(dllPath + 'og-common', {
     /*
    @brief 分配共享内存(创建a逻辑内存-a磁盘映射)
    @param[in] name 共享内存块名称(其他进程ref时需同名)
    @param[in] size 共享内存块大小(字节单位)
    @param[in/out] handle 共享内存块句柄(unref释放时需传入，size_t = uint64)
    @rerurn 共享内存块首地址
  */
    shmalloc: ['uchar *', ['uint64 *', 'string', 'uint64']],
    /*
    @brief 引用共享内存(创建a+逻辑内存-磁盘映射)
    @param[in] name 共享内存块名称(其他进程已shmalloc分配同名共享内存块)
    @param[in] handle 共享内存块句柄(unref释放时需传入，size_t = uint64)
    @rerurn 共享内存块首地址
    */
    ref: ['uchar *', ['uint64 *', 'string']],
    /*
    @brief 释放共享内存(解除映射)
    @param[in] handle 共享内存块句柄(shmalloc或ref时获取)
    @param[in] ptr 共享内存块首地址(shmalloc或ref时返回)
    @hint  共享内存块仅当所有shmalloc/ref方均已unref时才真正释放回收
    */
    unref: ['void', ['uint64 *', 'uchar *']],
    /*
    @brief 读图片
    @param[in] img_path 读入图片的路径
    @param[in/out] img_data 读入图片的数据指针
    @param[in] img_h 读入图片的高
    @param[in] img_w 读入图片的宽
    @param[in] img_c 读入图片的通道数
    @param[in] is_utf8 img_path是否为utf8编码
    @return 是否成功
    */
    imread: ['bool', ['string', 'uchar *', 'int', 'int', 'int', 'bool']],
    imread_mvf: ['bool', ['string', 'uchar *', 'int', 'int', 'int', 'bool']],
    /*
    @brief 写图片
    @param[in] img_path 写出图片的路径
    @param[in] img_data 写出图片的数据指针
    @param[in] img_h 写出图片的宽
    @param[in] img_w 写出图片的高
    @param[in] img_c 写出图片的通道数
    @param[in] is_utf8 file是否为utf8编码
    @return 是否成功
    */
    imwrite: ['void', ['string', 'uchar *', 'int', 'int', 'int', 'bool']],
    imwrite_async: ['void', ['string', 'uchar *', 'int', 'int', 'int', 'bool']],
    /*
    @brief bayerBG转rgba
    @param[in] bayerBG_data 转换前bayerBG图片的数据指针
    @param[in] height 图片的高
    @param[in] width 图片的宽
    @param[in/out] bgr_data 转换后bgr图片的数据指针
    */
    bayerBG2rgb: ['void', ['uchar *', 'int', 'int', 'uchar *']],
    /*
   @brief bayerBG转rgba
   @param[in] bayerBG_data 转换前bayerBG图片的数据指针
   @param[in] height 图片的高
   @param[in] width 图片的宽
   @param[in/out] bgr_data 转换后bgr图片的数据指针
   */
    bayerRG2rgb: ['void', ['uchar *', 'int', 'int', 'uchar *']],
    
  })
  return Library;
}
