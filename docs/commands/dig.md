---
name: dig
title: dig
description: 查询 DNS 解析记录
category: 网络
summary: 查询 DNS 解析记录
tags: [DNS, 域名, 排查]
---

## 它做什么

向 DNS 服务器查询域名记录，输出原始的解析响应。排查域名问题时它比 `nslookup` 信息全得多。

## 用法

```console
dig [选项] [域名] [记录类型]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `+short` | 只输出结果，最简洁 |
| `@服务器` | 指定 DNS 服务器，如 `@8.8.8.8` |
| `+trace` | 从根服务器开始逐级追踪解析过程 |
| `+noall +answer` | 只显示应答段 |
| `-x IP` | 反向查询，IP 查域名 |

## 常见记录类型

| 类型 | 含义 |
| --- | --- |
| `A` | 域名指向的 IPv4 地址 |
| `AAAA` | IPv6 地址 |
| `CNAME` | 域名别名 |
| `MX` | 邮件服务器 |
| `TXT` | 文本记录，常用来验证域名所有权 |
| `NS` | 负责解析的权威服务器 |

## 示例

最常用的一条：

```console
$ dig +short example.com
93.184.216.34
```

查完整应答：

```console
$ dig example.com A +noall +answer
```

指定 DNS 服务器，用来确认是不是本地 DNS 缓存的问题：

```console
$ dig @8.8.8.8 example.com
```

查邮件解析：

```console
$ dig example.com MX +short
```

## 说明

- 刚改完域名解析，DNS 需要时间传播（TTL 决定），`dig` 看到的是当前 DNS 服务器的结果，别急着下结论说没生效。
- 对比 `dig` 和 `dig @8.8.8.8` 的结果，能快速判断是运营商 DNS 的锅还是解析本身没配好。
- 装：`apt install dnsutils`（Debian 下的 `dig` 在这个包里）。
