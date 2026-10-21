---
name: journalctl
title: journalctl
description: 查询 systemd 日志
category: 进程与系统
summary: 查询 systemd 日志
tags: [日志, 排查, systemd]
---

## 它做什么

读取 systemd 统一收集的二进制日志。用了 systemd 的系统，所有服务日志都从这里看，不用再挨个翻 `/var/log`。

## 用法

```console
journalctl [选项]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-u 单元` | 只看某个服务的日志 |
| `-f` | 实时跟随，等同 tail -f |
| `-n 数字` | 只看最近多少条，默认 10 |
| `-r` | 倒序输出，最新的在前 |
| `--since 时间` | 起始时间，`"2026-10-16 09:00"` 或 `"2 hours ago"` |
| `--until 时间` | 截止时间 |
| `-p 级别` | 按优先级过滤，如 `-p err` |
| `-b` | 只看本次启动以来的日志 |
| `--no-pager` | 不分页，直接全部输出 |
| `--disk-usage` | 查看日志占用了多少磁盘 |

## 示例

看 nginx 的实时日志：

```console
$ journalctl -u nginx -f
```

只看今天 9 点以后的错误：

```console
$ journalctl --since "2026-10-16 09:00" -p err
```

排查昨天那次重启：

```console
$ journalctl -b -1 -r
```

清理一个月前的日志：

```console
$ journalctl --vacuum-time=30d
```

## 说明

- 默认所有非 root 用户只能看自己的日志，看系统级日志要加 `sudo` 或把自己加进 `adm` / `systemd-journal` 组。
- 日志默认存在 `/var/log/journal`，是二进制格式，**只能由 journalctl 读**。有些发行版默认只存内存里（`/run/log/journal`），重启即丢，需要改 `/etc/systemd/journald.conf` 里的 `Storage=persistent`。
- 想看启动失败原因，`systemctl status 服务` 会顺带显示最后几行，比手敲 journalctl 快。
