---
name: ip
title: ip
description: 查看与配置网络接口
category: 网络
summary: 查看与配置网络接口
tags: [网络配置, 接口, IP]
---

## 它做什么

管理网卡地址、路由表和链路状态。它取代了老的 `ifconfig`，后者在很多新发行版里已经不装了。

## 用法

```console
ip [选项] 对象 命令
```

## 常用对象

| 对象 | 作用 |
| --- | --- |
| `addr` | IP 地址管理 |
| `link` | 网卡链路层状态 |
| `route` | 路由表 |
| `neigh` | ARP 表 |

## 示例

看网卡与 IP（相当于老 `ifconfig`）：

```console
$ ip addr show
```

简洁版，只看 IPv4：

```console
$ ip -4 -br addr
lo               UNKNOWN        127.0.0.1/8
eth0             UP             10.0.0.5/24
```

看路由表，确认默认网关：

```console
$ ip route
default via 10.0.0.1 dev eth0 proto dhcp
```

看网卡状态：

```console
$ ip link show eth0
```

## 说明

- 常用缩写：`ip a`（地址）、`ip r`（路由）、`ip l`（链路）。`-br` 输出精简，一眼能读完。
- 显示 DOWN 的网卡要 `ip link set eth0 up` 拉起来。
- 老教程里的 `ifconfig` 属于 net-tools，Debian 12、Ubuntu 24.04 之后默认不预装，尽早习惯 `ip`。
- 想知道本机出网的公网 IP：`curl -s ifconfig.me` 或 `dig +short myip.opendns.com @resolver1.opendns.com`。
