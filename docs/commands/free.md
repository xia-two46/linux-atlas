---
name: free
title: free
description: 查看内存与交换分区用量
category: 进程与系统
summary: 查看内存与交换分区用量
tags: [内存, 监控, 排查]
---

## 它做什么

显示物理内存、交换分区（swap）和内核缓冲区的总量、已用、可用情况。

## 用法

```console
free [选项]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-h` | 人类可读格式，自动换成 K/M/G |
| `-m` | 以 MB 为单位 |
| `-s 秒` | 持续刷新，每隔 N 秒输出一次 |
| `-c 次数` | 配合 -s，输出指定次数后停止 |
| `-w` | 把 buffers 和 cache 分开显示 |

## 示例

```console
$ free -h
              total        used        free      shared  buff/cache   available
Mem:          3.8Gi       1.2Gi       412Mi        19Mi       2.2Gi       2.3Gi
Swap:         2.0Gi          0B       2.0Gi
```

每 2 秒看一次变化：

```console
$ free -h -s 2
```

## 说明

- **别被 `free` 那一列骗了。** Linux 会把空闲内存拿去做磁盘缓存（buff/cache），这部分内存随时可以腾给程序用，所以真正该看的是最后一列 **available**。
- `used` 很高不代表内存不够，要结合 `available` 和 swap 的使用量一起判断。
- swap 开始被大量使用说明物理内存真的吃紧了，这时系统通常已经开始变卡。
- 更详细的信息在 `/proc/meminfo`。
