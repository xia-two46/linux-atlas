---
name: lsblk
title: lsblk
description: 列出块设备与挂载情况
category: 磁盘与归档
summary: 列出块设备与挂载情况
tags: [磁盘, 分区, 查看]
---

## 它做什么

用树形结构显示磁盘、分区和挂载点，一眼看清哪个分区挂在哪个目录下。

## 用法

```console
lsblk [选项] [设备]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-f` | 显示文件系统类型与 UUID |
| `-m` | 显示属主和权限 |
| `-o 字段` | 自定义输出列 |
| `-a` | 包含空设备 |
| `-p` | 显示完整设备路径 |

## 示例

```console
$ lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sda      8:0    0   40G  0 disk
├─sda1   8:1    0   39G  0 part /
└─sda2   8:2    0    1G  0 part [SWAP]
```

看文件系统类型和 UUID（写 fstab 时需要）：

```console
$ lsblk -f
```

只关心名称和挂载点：

```console
$ lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINT
```

## 说明

- 没挂载的分区会出现在列表里但没有 MOUNTPOINT，新加磁盘后通常要分区、格式化、再挂载三部曲。
- `MOUNTPOINTS` 为空不代表磁盘坏了，只是没挂。
- 配合 `df -h` 一起看最完整：`lsblk` 看结构，`df` 看空间占用。
- 上面的树形结构中 `sr0` 是光驱，`loop*` 通常是 snap 这类打包应用的虚拟设备。
