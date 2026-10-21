---
name: wget
title: wget
description: 命令行下载文件
category: 网络
summary: 命令行下载文件
tags: [下载, HTTP, 抓取]
---

## 它做什么

通过 HTTP、HTTPS、FTP 下载文件。和 curl 相比，它默认就把文件存到磁盘，并且支持递归下载整个站点。

## 用法

```console
wget [选项] URL
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-O 文件` | 另存为指定文件名 |
| `-c` | 断点续传 |
| `-b` | 转到后台下载 |
| `-q` | 静默模式 |
| `-r` | 递归下载 |
| `-N` | 只下载比本地新的文件 |
| `--limit-rate=速度` | 限速，如 `--limit-rate=200k` |
| `--no-check-certificate` | 不校验 SSL 证书 |
| `-i 文件` | 从文件里读取多个 URL 批量下载 |

## 示例

基本下载：

```console
$ wget https://example.com/file.tar.gz
```

断点续传，网络断了再跑一次就能接着下：

```console
$ wget -c https://example.com/big-file.iso
```

下载后另存为：

```console
$ wget -O node.tar.xz https://nodejs.org/dist/v22.11.0/node-v22.11.0.tar.xz
```

镜像一个静态站到本地：

```console
$ wget -r -p -np -k https://example.com/
```

## 说明

- `wget` 适合"下载到文件"，`curl` 适合"看响应、调接口"。curl 默认把内容打到屏幕，wget 默认存盘。
- `-O` 只指定文件名，**所有下载都写这一个文件**；`-P 目录` 才是指定保存目录。
- 下载命令取自不可信来源时，先 `-O - | less` 看一眼内容再执行，别直接 `wget ... | sh`。
- 有些发行版默认只有 curl，`apt install wget` 装上。
