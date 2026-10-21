---
name: id
title: id
description: 查看用户的 UID、GID 与所属组
category: 权限与用户
summary: 查看用户的 UID、GID 与所属组
tags: [用户, 权限, 排查]
---

## 它做什么

显示当前（或指定）用户的 UID、主组 GID 以及所有附加组。排查"我为什么没权限"时，这是第一步。

## 用法

```console
id [选项] [用户名]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-u` | 只显示 UID |
| `-g` | 只显示主组 GID |
| `-G` | 显示所有组的 GID |
| `-n` | 显示名称而不是数字，配合上面三个用 |
| `-r` | 显示真实 ID 而非有效 ID |

## 示例

```console
$ id
uid=1000(deploy) gid=1000(deploy) groups=1000(deploy),27(sudo),999(docker)
```

只看组名：

```console
$ id -nG
deploy sudo docker
```

看别人的：

```console
$ id www-data
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

## 说明

- 每个用户有一个**主组**（`-g`）和若干**附加组**（`-G`）。新建文件时属组默认是主组。
- 判断有没有 sudo 权限，看 groups 里有没有 `sudo`（Debian/Ubuntu）或 `wheel`（Red Hat/CentOS）。
- 改了组之后 `id` 立刻显示新的，但已运行的进程不会生效，需要重新登录。
- `whoami` 只显示用户名，`id` 显示的信息全得多。
