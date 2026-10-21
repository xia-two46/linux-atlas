---
name: zip
title: zip
description: 创建与解压 ZIP 压缩包
category: 磁盘与归档
summary: 创建与解压 ZIP 压缩包
tags: [压缩, 打包, 跨平台]
---

## 它做什么

创建和解压 ZIP 格式压缩包。`tar` 在 Linux 世界更主流，但**要发给用 Windows 的人，就用 zip**。

## 用法

```console
zip [选项] 压缩包名 文件...
unzip [选项] 压缩包名
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-r` | 递归打包目录 |
| `-q` | 静默模式 |
| `-e` | 加密，解压时需要输密码 |
| `-x 模式` | 排除指定文件 |
| `-9` | 最高压缩率，速度更慢 |
| `-d 目录` | unzip 专用，解压到指定目录 |

## 示例

打包一个目录：

```console
$ zip -r project.zip project/
```

排除依赖目录：

```console
$ zip -r code.zip . -x "node_modules/*" -x ".git/*"
```

用密码打包敏感文件：

```console
$ zip -e secrets.zip *.key
```

解压到指定目录：

```console
$ unzip site.zip -d /var/www/
```

不解包看一眼内容：

```console
$ unzip -l site.zip
```

## 说明

- 打包目录**必须加 `-r`**，否则只会得到一个空的 zip。
- 排除模式要用引号包起来，避免被 shell 提前展开。
- ZIP 的加密强度不高，真正的安全归档应该用 7z 的 AES，或先 tar 再用 GPG 加密。
- 中文文件名在跨平台解压时可能乱码，Linux 上用 `unzip -O gbk`（部分版本支持）或改用 tar.gz。
- 没装的话：`apt install zip unzip`。
