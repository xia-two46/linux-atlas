---
name: stat
title: stat
description: 查看文件的详细元数据
category: 文件与目录
summary: 查看文件的详细元数据
tags: [元数据, 时间戳, 权限]
---

## 它做什么

比 `ls -l` 更详细地显示文件元数据：大小、权限、inode 号、硬链接数、三个时间戳。

## 用法

```console
stat [选项] 文件...
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-c 格式` | 自定义输出格式 |
| `-t` | 简洁的单行摘要 |
| `-f` | 显示文件所在文件系统的状态 |

## 常用格式符

| 格式符 | 输出 |
| --- | --- |
| `%n` | 文件名 |
| `%s` | 字节数 |
| `%a` | 八进制权限，如 644 |
| `%U` | 属主用户名 |
| `%y` | 最后修改时间 |
| `%i` | inode 号 |

## 示例

```console
$ stat index.html
```

只取修改时间和文件名，方便写脚本：

```console
$ stat -c '%y %n' index.html
```

批量看权限：

```console
$ stat -c '%a %n' /etc/nginx/*
```

## 说明

- 三个时间戳要分清：**atime** 最后访问、**mtime** 内容最后修改、**ctime** 状态（权限、属主、链接数）最后改变。改权限会让 ctime 变化，但不会动 mtime。
- 很多人以为 ctime 是"创建时间"，其实 Linux 一般没有创建时间的概念（ext4 有 crtime 但要单独查看）。
