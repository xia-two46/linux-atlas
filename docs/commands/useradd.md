---
name: useradd
title: useradd
description: 创建系统用户
category: 权限与用户
summary: 创建系统用户
tags: [用户, 账号, 管理]
---

## 它做什么

创建新用户账号。Debian 系还有一个交互式的 `adduser`，是 `useradd` 的友好封装。

## 用法

```console
useradd [选项] 用户名
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-m` | 同时创建家目录 `/home/用户名` |
| `-s shell` | 指定登录 shell，如 `-s /bin/bash` |
| `-G 组` | 加入附加组，多个用逗号分隔 |
| `-u UID` | 指定用户 ID |
| `-d 目录` | 指定家目录位置 |
| `-r` | 创建系统账号，UID 较小，通常给服务用 |

## 示例

创建一个能正常登录的普通用户：

```console
$ sudo useradd -m -s /bin/bash deploy
$ sudo passwd deploy
```

创建用户并赋予 sudo 权限：

```console
$ sudo useradd -m -s /bin/bash -G sudo deploy
```

给服务创建专用账号（不允许登录）：

```console
$ sudo useradd -r -s /usr/sbin/nologin nginx-worker
```

## 说明

- **不加 `-m` 是新手最常见的坑**：用户建好了但没有家目录，登录时会报 "No directory" 或落进根目录。
- 用户的信息记录在 `/etc/passwd`，密码在 `/etc/shadow`（加密存储），组信息在 `/etc/group`。
- 删除用户用 `userdel -r 用户名`，`-r` 会一并删掉家目录。
- 服务建议用 `-s /usr/sbin/nologin` 创建**不能登录**的专用账号，安全性高得多。
