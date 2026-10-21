---
name: ss
title: ss
description: 查看套接字与端口占用
category: 网络
summary: 查看套接字与端口占用
tags: [端口, 连接, 排查]
---

## 它做什么

显示 socket 统计信息，用来查看端口监听情况和网络连接。它取代了老的 `netstat`，速度快得多。

## 用法

```console
ss [选项]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-t` | 只看 TCP |
| `-u` | 只看 UDP |
| `-l` | 只看处于监听状态的 |
| `-n` | 不解析服务名，直接显示端口号 |
| `-p` | 显示占用端口的进程 |
| `-a` | 显示全部 |
| `-s` | 输出汇总统计 |

## 示例

看所有监听中的 TCP 端口：

```console
$ ss -tlnp
State    Recv-Q   Send-Q   Local Address:Port   Peer Address:Port
LISTEN   0        128      0.0.0.0:22           0.0.0.0:*       users:(("sshd",pid=842,fd=3))
LISTEN   0        511      0.0.0.0:80           0.0.0.0:*       users:(("nginx",pid=1203,fd=6))
```

看 80 端口被谁占了：

```console
$ sudo ss -tlnp | grep :80
```

各类连接的汇总统计：

```console
$ ss -s
```

## 说明

- `-p` 需要 root 权限才能看到别人的进程，普通用户只能看到自己名下的。
- 记忆组合 `-tlnp`，四个字母分别是 TCP、监听、数字端口、进程。
- `netstat` 属于 net-tools，许多新发行版已经默认不装，尽早习惯 `ss`。
- 想反过来按进程查端口，`lsof -i:80` 更直接。
