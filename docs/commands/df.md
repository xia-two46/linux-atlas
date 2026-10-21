---
name: df
title: df
description: 查看磁盘空间使用情况
category: 磁盘与归档
summary: 查看磁盘空间使用情况
tags: [磁盘, 空间, 挂载]
---

## 它做什么

报告文件系统的磁盘空间占用，包括总容量、已用、可用和挂载点。

## 用法

```console
df [选项] [文件或目录...]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-h` | 以 K、M、G 为单位显示 |
| `-T` | 显示文件系统类型，如 ext4、xfs |
| `-i` | 显示 inode 使用情况而不是容量 |
| `-x 类型` | 排除指定类型，如 `-x tmpfs` |

## 示例

人类可读格式查看：

```console
$ df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        40G   18G   20G  48% /
tmpfs           3.9G     0  3.9G   0% /dev/shm
```

连同文件系统类型一起看：

```console
$ df -hT
```

查看某个文件所在分区还剩多少：

```console
$ df -h /var/log
```

## 说明

- 磁盘明明还有空间却提示 "No space left on device"，多半是 **inode 用完了**（常见于大量小文件），用 `df -i` 就能确认。
- 文件删掉了但空间没释放，通常是有进程仍持有它的文件句柄。用 `lsof | grep deleted` 找出该进程，重启它即可释放。
- 输出的 `Use%` 超过 80% 就该清理了，到 100% 时很多服务会直接写不进去。
