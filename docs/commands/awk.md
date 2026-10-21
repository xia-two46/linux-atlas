---
name: awk
title: awk
description: 按列处理文本的编程语言
category: 文本处理
summary: 按列处理文本的编程语言
tags: [列处理, 统计, 报告]
---

## 它做什么

逐行读入文本，默认按空白切分成字段，用 `$1`、`$2` 引用，并能在处理前后执行动作。它其实是一门完整的编程语言，用来做列提取和汇总统计特别顺手。

## 用法

```console
awk [选项] '模式 { 动作 }' [文件...]
```

## 常用内置变量

| 变量 | 含义 |
| --- | --- |
| `$0` | 整行内容 |
| `$1` … `$n` | 第 1 到第 n 个字段 |
| `NF` | 当前行的字段数 |
| `NR` | 当前行号，跨文件累加 |
| `FS` | 输入字段分隔符，默认是任意空白 |
| `OFS` | 输出字段分隔符 |
| `FNR` | 在当前文件内的行号 |

## 示例

取出第 1 列和第 3 列：

```console
$ awk '{print $1, $3}' data.txt
```

以冒号分隔，取出 /etc/passwd 里的用户名和登录 shell：

```console
$ awk -F: '{print $1, $7}' /etc/passwd
```

累加第 2 列，最后输出总和：

```console
$ awk '{sum += $2} END {print sum}' sales.txt
```

只处理第 2 列大于 100 的行：

```console
$ awk '$2 > 100 {print $1, $2}' sales.txt
```

跳过表头再统计行数：

```console
$ awk 'NR > 1 {count++} END {print count}' users.csv
```

按第 1 列分组求和：

```console
$ awk '{total[$1] += $2} END {for (k in total) print k, total[k]}' data.txt
```

## 说明

- `END` 块在所有行处理完后执行，适合输出汇总结果；`BEGIN` 块在处理开始前执行，常用来设置 `FS` 和打印表头。
- `-F` 支持正则，比如 `-F'[,:]'` 表示逗号或冒号都算分隔符。
- 处理真正的 CSV（字段里含引号和逗号）时 awk 会力不从心，改用 Python 的 csv 模块或 `csvkit` 更稳妥。
