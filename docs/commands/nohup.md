---
name: nohup
title: nohup
description: 让进程在退出终端后继续运行
category: 进程与系统
summary: 让进程在退出终端后继续运行
tags: [后台, 守护, 会话]
---

## 它做什么

让进程忽略挂断信号（SIGHUP），这样关闭终端或退出 SSH 之后它依然在跑。常和 `&` 配合使用。

## 用法

```console
nohup 命令 [参数] &
```

## 示例

后台跑一个服务，并把输出存到文件：

```console
$ nohup python3 server.py > server.log 2>&1 &
```

查看它生成的进程：

```console
$ ps aux | grep server.py
```

## 说明

- 不加重定向时，输出默认写进当前目录的 `nohup.out`，长时间运行会撑得很大，建议总是显式指定日志文件。
- `nohup` 只能防 SSH 断连，不能防进程自己崩溃。想让它崩了自动重启，要用 systemd 或 supervisor 托管。
- 更现代的做法是写成 systemd 服务（`systemctl start xxx`），日志由 journalctl 统一管，比 nohup 好管理得多。
- 想让已经在跑的进程也脱离终端，可以用 `disown -h %1` 或先 Ctrl+Z 挂起再 `bg` 放回后台。
