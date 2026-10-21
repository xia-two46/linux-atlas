---
name: dd
title: dd
description: 按块复制文件与设备
category: 磁盘与归档
summary: 按块复制文件与设备
tags: [磁盘, 镜像, 危险]
---

> **危险**：`of=` 写错会把目标盘的数据全部抹掉。它会无条件覆盖，没有回收站，也没有第二次确认。

## 它做什么

按指定的块大小逐字节复制数据。因为它能把任何东西读成字节流，所以既能拷文件，也能整盘克隆、写启动盘、生成测试文件。

## 用法

```console
dd if=输入 of=输出 [选项]
```

## 常用参数

| 参数 | 说明 |
| --- | --- |
| `if=` | 输入文件或设备 |
| `of=` | 输出文件或设备 |
| `bs=` | 块大小，加大能显著提升速度 |
| `count=` | 只复制多少块 |
| `status=progress` | 显示实时进度 |
| `conv=fdatasync` | 结束前确保数据真的落盘 |

## 示例

把系统镜像写进 U 盘：

```console
$ sudo dd if=ubuntu-24.04.iso of=/dev/sdb bs=4M status=progress conv=fdatasync
```

备份整个分区：

```console
$ sudo dd if=/dev/sda1 of=/mnt/backup/sda1.img bs=4M status=progress
```

生成一个 1G 的测试文件：

```console
$ dd if=/dev/zero of=testfile bs=1M count=1024
```

测磁盘写入速度：

```console
$ dd if=/dev/zero of=./speedtest bs=1G count=1 oflag=direct
```

## 说明

- **`if` 和 `of` 千万不要写反**，这是最经典的"一个命令毁掉一台机器"。写入目标前务必先用 `lsblk` 确认设备名。
- 指定的是`/dev/sdb` 这种整盘设备，不是 `/dev/sdb1` 分区——制作安装盘要写整块设备。
- 默认没有任何进度显示，加上 `status=progress` 才看得到。
- 常见的特殊输入：`/dev/zero` 无限个 0、`/dev/urandom` 随机数据、`/dev/null` 黑洞。
