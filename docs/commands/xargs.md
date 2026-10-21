---
name: xargs
title: xargs
description: 把标准输入转换成命令参数
category: Shell 与脚本
summary: 把标准输入转换成命令参数
tags: [管道, 批量, 参数]
---

## 它做什么

读取标准输入，把它作为参数传给后面的命令。`find`、`ls` 这类输出文件名的命令，想让结果被其他命令逐个处理，就要靠它搭桥。

## 用法

```console
命令 | xargs [选项] [目标命令]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-n 数字` | 每次传给目标命令的参数个数 |
| `-I {}` | 用占位符把参数插到命令的任意位置 |
| `-0` | 以 null 字符分隔输入，配合 `find -print0` |
| `-P 数字` | 并行执行，加快批量处理 |
| `-t` | 执行前先把命令打印出来 |
| `-r` | 输入为空时不执行 |

## 示例

批量删除：

```console
$ find . -name "*.tmp" | xargs rm
```

把文件名插到命令中间，逐个备份：

```console
$ ls *.txt | xargs -I {} cp {} {}.bak
```

文件名带空格也不会出错的写法：

```console
$ find . -name "*.log" -print0 | xargs -0 rm
```

并行转码，8 个任务同时跑：

```console
$ ls *.png | xargs -P 8 -n 1 cwebp -quiet
```

先看看会执行什么，确认后再去掉 `-t` 真正执行：

```console
$ find . -name "*.js" | xargs -t wc -l
```

## 说明

- 文件名里有空格时，普通 `xargs` 会把它拆成两个参数。必须成对使用 `find -print0` 和 `xargs -0`。
- 想让参数出现在命令中间而不是末尾，用 `-I {}`，比如 `xargs -I {} mv {} /tmp/`。
- `xargs` 默认把所有输入拼成一条命令，参数太多会报 "Argument list too long"，这时 `-n` 分批就能解决。
