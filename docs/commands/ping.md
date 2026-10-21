---
name: ping
title: ping
description: 测试网络连通性与延迟
category: 网络
summary: 测试网络连通性与延迟
tags: [连通性, 网络排查, ICMP]
---

## 它做什么

向目标主机发送 ICMP 回显请求，测量能否连通以及往返延迟。网络排查的第一步永远是它。

## 用法

```console
ping [选项] 主机
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-c 次数` | 发送指定次数后停止，Linux 上几乎是必加的 |
| `-i 秒` | 发送间隔，默认 1 秒 |
| `-W 秒` | 等待响应的超时时间 |
| `-s 字节` | 指定数据包大小 |
| `-t 数字` | 设置 TTL |
| `-4` / `-6` | 强制使用 IPv4 / IPv6 |
| `-q` | 只输出汇总结果 |

## 示例

发 4 个包就停（Linux 默认会一直发）：

```console
$ ping -c 4 example.com
PING example.com (93.184.216.34) 56(84) bytes of data.
64 bytes from 93.184.216.34: icmp_seq=1 ttl=56 time=12.3 ms
--- example.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
```

只关心汇总：

```console
$ ping -c 10 -q example.com
```

## 说明

- **Linux 的 ping 默认不会自己停**，要按 Ctrl+C 或加 `-c`。Windows 上默认发 4 个，这是两地习惯的分歧点。
- ping 不通 ≠ 主机挂了。很多服务器会屏蔽 ICMP，但 Web 服务照样正常。这时用 `curl -I` 或 `nc -zv host 80` 验证端口更有意义。
- 输出里的 **time** 是往返延迟：同机房一般小于 1ms，跨国通常 100~300ms。**丢包率**比延迟高低更值得关注。
- 探测路径哪一段出问题用 `traceroute` 或 `mtr`。
