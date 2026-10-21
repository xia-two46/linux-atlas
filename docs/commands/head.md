---
name: head
title: head
description: 查看文件开头若干行
category: 文本处理
summary: 查看文件开头若干行
tags: [查看, 截断, 日志]
---

## 它做什么

输出文件开头的若干行，默认 10 行。它的孪生命令 `tail` 输出结尾若干行，加 `-f` 可以实时跟踪日志。

## 用法

```console
head [选项] [文件...]
tail [选项] [文件...]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-n 数字` | 指定行数，可以简写成 `-20` |
| `-c 字节数` | 按字节截取 |
| `-f` | tail 专用，持续输出新增内容 |
| `-F` | tail 专用，同上，且文件被轮转重建后会自动重新打开 |
| `-n +N` | tail 专用，从第 N 行输出到结尾 |

## 示例

看前 20 行：

```console
$ head -20 access.log
```

实时盯住日志：

```console
$ tail -f /var/log/nginx/access.log
```

跳过 CSV 表头，只取正文：

```console
$ tail -n +2 users.csv
```

取第 81 到 100 行：

```console
$ head -100 data.txt | tail -20
```

## 说明

- 跟踪日志时用 `tail -F` 比 `-f` 稳。日志轮转（logrotate）把文件改名重建后，`-f` 会一直盯着旧文件，看起来就像日志"停了"。
- 想同时看多个日志可以 `tail -f a.log b.log`，输出会用 `==> 文件名 <==` 分隔。
- `head` 不只能看文件，配合管道可以截断任何命令的长输出。
