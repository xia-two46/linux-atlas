---
name: sudo
title: sudo
description: 以其他用户身份执行命令
category: 权限与用户
summary: 以其他用户身份执行命令
tags: [提权, root, 安全]
featured: true
---

## 它做什么

以另一个用户（默认 root）的身份执行一条命令。它比直接 `su` 成 root 安全，因为权限只在这一条命令内生效，而且会留下审计日志。

## 用法

```console
sudo [选项] 命令
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-u 用户` | 以指定用户身份执行，如 `sudo -u www-data` |
| `-i` | 启动一个完整的 root 登录 shell |
| `-s` | 启动 root shell，但保留当前环境 |
| `-l` | 列出当前用户被允许执行的命令 |
| `-k` | 立即作废已缓存的凭据 |
| `-E` | 保留当前环境变量 |

## 示例

更新软件包：

```console
$ sudo apt update && sudo apt upgrade
```

以服务账户身份测试配置：

```console
$ sudo -u www-data nginx -t
```

看看自己有哪些 sudo 权限：

```console
$ sudo -l
```

## 说明

- 授权配置在 `/etc/sudoers`，**永远用 `visudo` 编辑**。它会在保存时检查语法，写错了也不会把自己锁在系统外面。
- 想免密执行某条命令，在 sudoers 里加 `用户名 ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx`，比开放全部权限安全得多。
- 默认免密时长是 5 分钟，离开工位前可以主动 `sudo -k` 作废凭据。
- 重定向时要注意：`sudo echo x > /etc/f` 里的 `>` 是以普通用户身份执行的，会直接失败。正确写法是 `echo x | sudo tee /etc/f`。
