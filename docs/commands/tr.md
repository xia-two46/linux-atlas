---
name: tr
title: tr
description: 字符替换、删除与压缩
category: 文本处理
summary: 字符替换、删除与压缩
tags: [替换, 转换, 清洗]
---

## 它做什么

对输入做**单个字符**层面的转换：替换、删除、压缩重复字符。它不处理字符串，也不支持正则。

## 用法

```console
tr [选项] 字符集1 [字符集2]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-d` | 删除字符集 1 中的所有字符 |
| `-s` | 压缩连续重复字符为一个 |
| `-c` | 取反，操作字符集 1 之外的字符 |
| `-t` | 把字符集 1 截断到与字符集 2 等长 |

## 示例

小写转大写：

```console
$ echo "hello linux" | tr a-z A-Z
HELLO LINUX
```

Windows 换行符转 Unix：

```console
$ tr -d '\r' < win.txt > unix.txt
```

把连续空行压缩成一行：

```console
$ tr -s '\n' < file.txt
```

把多个空格压成一个，方便后续 cut 或 sort：

```console
$ cat data.txt | tr -s ' ' | cut -d' ' -f2
```

## 说明

- `tr` 只做逐字符映射，**不能替换字符串**。`tr 'abc' 'xyz'` 是把 a→x、b→y、c→z，而不是把 "abc" 换成 "xyz"。要替换字符串请用 `sed`。
- 字符集可以用范围写法 `a-z`、`0-9`，也可以用 POSIX 类 `[:upper:]`、`[:space:]`。
- 它只处理标准输入，不能直接跟文件名，要用 `<` 或管道。
