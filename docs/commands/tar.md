---
name: tar
title: tar
description: 打包与解包归档文件
category: 磁盘与归档
summary: 打包与解包归档文件
tags: [压缩, 打包, 备份]
featured: true
---

## 它做什么

把多个文件和目录打包成一个归档文件，可选调用 gzip、bzip2 或 xz 压缩。名字来自 tape archive。

## 用法

```console
tar [选项] 归档文件 [文件或目录...]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-c` | 创建归档 |
| `-x` | 解包 |
| `-t` | 列出归档内容，不解包 |
| `-f 文件` | 指定归档文件名，几乎总是要加 |
| `-v` | 显示处理过程 |
| `-z` | 用 gzip 压缩或解压，对应 .tar.gz |
| `-j` | 用 bzip2，对应 .tar.bz2 |
| `-J` | 用 xz，对应 .tar.xz |
| `-C 目录` | 解压到指定目录 |
| `--exclude=模式` | 打包时排除匹配内容 |
| `-p` | 保留原始权限 |

## 示例

打包并用 gzip 压缩：

```console
$ tar -czvf site.tar.gz ./dist
```

解压到指定目录：

```console
$ tar -xzvf site.tar.gz -C /var/www/
```

不解包，先看看里面有什么：

```console
$ tar -tzvf site.tar.gz
```

打包时排除版本控制和依赖目录：

```console
$ tar -czf backup.tar.gz --exclude=.git --exclude=node_modules ./project
```

## 说明

- 记忆口诀：**c** 创建、**x** 解包、**z** gzip、**v** 显示过程、**f** 指定文件。
- 解压前先用 `tar -tzf` 看一眼内容，能避免"解包炸弹"式地在当前目录散落一地文件。
- 现代 GNU tar 能自动识别压缩格式，解压时其实可以省掉 `-z`，直接 `tar -xf a.tar.gz`。
- 做系统备份时常用 `tar -czpvf`，其中 `-p` 保留权限，`-v` 便于观察进度。
