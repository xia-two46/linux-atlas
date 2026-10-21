---
name: file
title: file
description: 判断文件的真实类型
category: 文件与目录
summary: 判断文件的真实类型
tags: [类型, 识别, 排查]
---

## 它做什么

通过读取文件头部的"魔数"判断真实格式，而不是只看扩展名。

## 用法

```console
file [选项] 文件...
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-b` | 不输出文件名，只输出类型 |
| `-i` | 输出 MIME 类型 |
| `-L` | 跟随符号链接，查看它指向的目标 |
| `-z` | 尝试查看压缩文件内部的内容 |

## 示例

```console
$ file report.txt
report.txt: UTF-8 Unicode text
```

扩展名骗人时特别有用：

```console
$ file unknown.bin
unknown.bin: gzip compressed data, was named old.txt
```

看符号链接到底指向什么：

```console
$ file -L /usr/bin/python
/usr/bin/python: ELF 64-bit LSB executable, x86-64
```

## 说明

- 排查"这文件究竟是什么格式"时，它比看扩展名可靠得多。
- 输出里出现 `with CRLF line terminators` 说明是 Windows 换行符，跨平台传脚本时很常见，用 `dos2unix` 可以转换。
- 返回 `data`（什么都没识别出来）时，通常意味着这是个加密文件或自定义二进制格式。
