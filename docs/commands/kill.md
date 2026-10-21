---
name: kill
title: kill
description: 向进程发送信号
category: 进程与系统
summary: 向进程发送信号
tags: [进程, 信号, 终止]
---

## 它做什么

默认发送 `TERM` 信号请求进程退出。它并不是"杀死"，而是发信号——进程可以忽略 `TERM`，但无法忽略 `KILL`。

## 用法

```console
kill [选项] PID...
```

## 常用信号

| 信号 | 编号 | 含义 |
| --- | --- | --- |
| `TERM` | 15 | 请求退出，进程可以自行清理（默认） |
| `KILL` | 9 | 强制终止，无法被捕获或忽略 |
| `HUP` | 1 | 挂起，常用来让守护进程重读配置 |
| `INT` | 2 | 中断，等价于 Ctrl+C |
| `QUIT` | 3 | 退出并生成 core dump |
| `STOP` | 19 | 暂停进程，可用 `CONT` 恢复 |

## 示例

正常请求退出：

```console
$ kill 1234
```

强制终止，最后手段：

```console
$ kill -9 1234
```

让 nginx 重读配置而不重启：

```console
$ sudo kill -HUP $(cat /run/nginx.pid)
```

按名字结束进程：

```console
$ pkill -f "python train.py"
```

## 说明

- **先用 `kill`，不行再 `kill -9`**。直接 -9 会让进程来不及写回数据和清理临时文件。
- `kill -9` 也杀不掉的情况通常只有一种：进程卡在不可中断的 IO（`D` 状态）。这时要先解决底层的磁盘或网络问题。
- `pkill -f` 匹配的是完整命令行，容易误伤。动手前先用 `pgrep -af 名字` 看清楚会命中哪些进程。
