﻿# kl-ipcTest
用于测试工控机性能的小脚本

https://github.com/muyikk/kl-ipcTest
### 一、服务名称
工控机写图测试程序v1.0.0
	
### 二、使用方式
1、将用于测试的图片（默认3通道）放入程序的目录

2、保证目录中包含ipc_test.exe、og-common.dll图片(.jpg  .jpeg  .png  .bmp)

3、使用powershell打开程序并输入参数“写图数量”，“间隔时间”，“是否删图”

4、程序会持续监控每秒cpu、内存、磁盘的占用情况，并在Ctrl+C时打印出测试期间cpu、内存、磁盘的平均使用率
