---
name: uname
title: uname
description: 查看系统与内核信息
category: 进程与系统
summary: 查看系统与内核信息
tags: [系统信息, 内核, 环境]
---

## 它做什么

输出操作系统与内核的基本信息。排查"我到底在什么环境上"时，这是第一条该敲的命令。

## 用法

```console
uname [选项]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-a` | 输出全部信息 |
| `-s` | 内核名称，默认就是这个 |
| `-r` | 内核版本 |
| `-m` | 硬件架构，如 x86_64、aarch64 |
| `-n` | 主机名 |
| `-o` | 操作系统 |

## 示例

查看完整信息：

```console
$ uname -a
Linux web-01 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux
```

只确认架构，决定下载哪个安装包：

```console
$ uname -m
x86_64
```

## 说明

- 想看发行版名称和版本号，`uname` 给不了，用 `cat /etc/os-release`。
- `-a` 的输出顺序是：内核名、主机名、内核版本、编译信息、架构、操作系统。
- 写跨平台脚本时，通常用 `uname -m` 判断架构、`uname -s` 判断系统类型，再决定走哪条分支。
