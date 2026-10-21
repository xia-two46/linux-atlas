---
name: scp
title: scp
description: 基于 SSH 的安全文件传输
category: 网络
summary: 基于 SSH 的安全文件传输
tags: [传输, 上传, 复制]
---

## 它做什么

在本地和远程主机之间复制文件，走 SSH 通道，天然加密。语法和 `cp` 几乎一样，只是路径可以带 `主机:路径` 的前缀。

## 用法

```console
scp [选项] 源 目标
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-r` | 递归复制整个目录 |
| `-P 端口` | 指定 SSH 端口（注意是大写 P） |
| `-i 私钥` | 指定私钥文件 |
| `-p` | 保留原文件的修改时间与权限 |
| `-C` | 压缩传输，慢网络上有用 |
| `-v` | 显示调试信息 |

## 示例

把本地文件传上去：

```console
$ scp report.txt user@host:/home/user/
```

从服务器拉下来：

```console
$ scp user@host:/var/log/nginx/access.log ./
```

传整个目录：

```console
$ scp -r dist/ user@host:/var/www/cmdatlas/
```

指定端口和私钥：

```console
$ scp -P 2222 -i ~/.ssh/id_ed25519 file.zip user@host:/tmp/
```

## 说明

- `-P` 大写、`ssh` 的命令是小写 `-p`，这对大小写差异是经典踩坑点。
- 上传网站、同步大量文件时，`rsync -avz` 更好——它只传差异部分，重传几乎瞬间完成，scp 每次都是全量。
- scp 默认会覆盖同名文件且没有提示。
- 新版 OpenSSH 已经把 scp 标记为较旧的实现，官方建议迁到 `sftp` 或 `rsync`。
