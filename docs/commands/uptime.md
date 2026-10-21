---
name: uptime
title: uptime
description: 查看运行时长与系统负载
category: 进程与系统
summary: 查看运行时长与系统负载
tags: [负载, 监控, 排查]
---

## 它做什么

一行输出四个信息：当前时间、已开机时长、登录用户数、过去 1/5/15 分钟的平均负载。

## 用法

```console
uptime [选项]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-p` | 只显示可读的运行时长 |
| `-s` | 显示开机的时间点 |

## 示例

```console
$ uptime
 17:20:31 up 42 days,  6:12,  2 users,  load average: 0.08, 0.03, 0.01
```

只想知道开了多久：

```console
$ uptime -p
up 6 weeks, 2 days, 18 hours
```

## 说明

- **负载怎么看**：对 N 核 CPU 的机器，负载值长期超过 N 说明有进程在排队等 CPU。1 分钟值突然飙高要看 5 分钟值是否也跟着涨——只是瞬间尖峰通常无害。
- 负载高不一定就是 CPU 忙，卡在不可中断 IO 的进程同样会被计入负载。
- `top` 第一行的那三个数就是这里的 load average。
