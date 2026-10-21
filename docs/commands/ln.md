---
name: ln
title: ln
description: 创建硬链接与符号链接
category: 文件与目录
summary: 创建硬链接与符号链接
tags: [链接, 软链接, 快捷方式]
---

## 它做什么

在文件之间建立链接。默认创建硬链接，加 `-s` 创建符号链接（软链接）。软链接可以跨文件系统，也能指向目录。

## 用法

```console
ln [选项] 源 目标
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-s` | 创建符号链接 |
| `-f` | 目标已存在时强制覆盖 |
| `-i` | 覆盖前询问 |
| `-n` | 把已存在的符号链接当作普通文件处理 |
| `-v` | 显示处理过程 |

## 示例

给长路径建一个短名字：

```console
$ ln -s /var/www/cmdatlas ~/site
```

切换软件版本常用的套路：

```console
$ ln -sfn node-v22.11.0 node
```

把站点配置挂到 Nginx 的启用目录：

```console
$ ln -sf /etc/nginx/sites-available/cmdatlas /etc/nginx/sites-enabled/
```

## 说明

- 硬链接和原文件共用同一个 inode，删掉原文件后链接依然可用；符号链接只是存了个路径，原文件没了它就失效。
- 硬链接不能跨文件系统，也不能指向目录；符号链接两者都行。
- 删除符号链接时用 `rm link` 而不是 `rm link/`，后者会连带删掉目标目录里的内容。
