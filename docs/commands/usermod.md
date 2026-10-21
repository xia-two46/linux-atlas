---
name: usermod
title: usermod
description: 修改已有用户的属性
category: 权限与用户
summary: 修改已有用户的属性
tags: [用户, 组, 管理]
---

## 它做什么

修改已存在用户的 shell、家目录、所属组、有效期等属性。

## 用法

```console
usermod [选项] 用户名
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-aG 组` | **追加**到附加组，必须和 -a 一起用 |
| `-G 组` | 重新设定附加组列表，会覆盖原来的 |
| `-s shell` | 修改登录 shell |
| `-d 目录` | 修改家目录，`-m` 会把文件一起搬过去 |
| `-l 新名` | 改用户名 |
| `-L` / `-U` | 锁定 / 解锁账号 |

## 示例

给用户加 sudo 权限：

```console
$ sudo usermod -aG sudo deploy
```

让用户跑 Docker 不用每次 sudo：

```console
$ sudo usermod -aG docker deploy
```

禁止某账号登录（比删号安全）：

```console
$ sudo usermod -L olduser
```

## 说明

- **`-G` 不带 `-a` 会覆盖原有的附加组**，用户可能会莫名其妙掉出之前所属的组。这个坑很常见，务必写成 `-aG`。
- 改完组之后，当前已登录的会话不会立即生效，需要重新登录（或 `newgrp 组名`）。
- Ubuntu 上想给默认用户开 Docker 权限，也是这一条命令。
