---
name: locate
title: locate
description: 用索引快速查找文件
category: 文件与目录
summary: 用索引快速查找文件
tags: [查找, 搜索, 索引]
---

## 它做什么

在一个预先建好的索引数据库里查文件名，速度远快于 `find`。缺点是结果可能不是最新的。

## 用法

```console
locate [选项] 模式
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-i` | 忽略大小写 |
| `-c` | 只统计数量 |
| `-l 数字` | 最多输出多少条 |
| `-b` | 只匹配路径最后一段 |
| `-e` | 只列出仍然存在的文件 |
| `-r` | 使用正则表达式 |

## 示例

```console
$ locate nginx.conf
```

只匹配文件名、不含路径，并限制结果条数：

```console
$ locate -b -l 20 "*.log"
```

## 说明

- 索引由 `updatedb` 维护，通常每天跑一次。刚创建的文件查不到是正常的，手动执行 `sudo updatedb` 可以立刻刷新——这也是它和 `find` 的核心区别：**locate 查的是快照，find 查的是当下**。
- 没装的话：`apt install mlocate`（Debian/Ubuntu）或 `dnf install mlocate`（Fedora）。
- 索引默认会跳过一部分路径，配置在 `/etc/updatedb.conf`。
