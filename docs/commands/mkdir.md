---
name: mkdir
title: mkdir
description: 创建目录
category: 文件与目录
summary: 创建目录
tags: [目录, 创建]
---

## 它做什么

创建新目录。加 `-p` 可以一次创建多级目录，并且目标已存在时不会报错。

## 用法

```console
mkdir [选项] 目录...
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-p` | 递归创建父目录，已存在也不报错 |
| `-v` | 显示创建过程 |
| `-m 权限` | 创建时直接指定权限 |

## 示例

创建一个目录：

```console
$ mkdir docs
```

一次建好整条路径：

```console
$ mkdir -p /var/www/cmdatlas/assets
```

建的时候直接给权限：

```console
$ mkdir -m 700 ~/.ssh
```

## 说明

- 写脚本时总是用 `mkdir -p`，能避免"目录已存在"的报错把脚本中断。
- 想一次建多个同级目录，用 shell 的花括号展开：`mkdir -p project/{src,dist,docs}`。
