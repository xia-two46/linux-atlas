---
name: uniq
title: uniq
description: 去除相邻重复行并统计
category: 文本处理
summary: 去除相邻重复行并统计
tags: [去重, 统计, 相邻]
---

## 它做什么

去掉**相邻**的重复行。因为只认相邻行，所以它几乎总是跟在 `sort` 后面用。

## 用法

```console
uniq [选项] [输入文件] [输出文件]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-c` | 在每行前加上出现次数 |
| `-d` | 只输出重复过的行，每组一次 |
| `-u` | 只输出没重复的行 |
| `-i` | 比较时忽略大小写 |
| `-f 数字` | 跳过前 N 个字段再比较 |
| `-s 数字` | 跳过前 N 个字符再比较 |

## 示例

排序后去重：

```console
$ sort ips.txt | uniq
```

统计每个 IP 出现几次（**最高频的用法**）：

```console
$ sort ips.txt | uniq -c | sort -nr
```

只看哪些行是重复的：

```console
$ sort data.txt | uniq -d
```

## 说明

- **必须先 sort**。原文件里 `A B A` 这样的分布，直接 `uniq` 会得到 `A B A`，去重毫无效果；`sort | uniq` 才能得到 `A B`。
- `sort -u` 等价于 `sort | uniq`，但如果要 `-c` 计数就必须用 uniq。
- 计数结果的格式是"次数 + 空格 + 行内容"，再接 `sort -nr` 就能按频次倒序排。这三件套是分析日志出现频率的标准写法。
