---
name: systemctl
title: systemctl
description: 管理 systemd 服务
category: 进程与系统
summary: 管理 systemd 服务
tags: [服务, 守护进程, 开机启动]
featured: true
---

## 它做什么

控制 systemd 的单元（unit）。管理服务是它最常见的用途，也能处理挂载点、定时器、socket 等。

## 用法

```console
systemctl <子命令> [单元名]
```

## 常用子命令

| 子命令 | 说明 |
| --- | --- |
| `start` | 启动 |
| `stop` | 停止 |
| `restart` | 重启，会中断服务 |
| `reload` | 重新加载配置，不中断服务 |
| `status` | 查看状态与最近几行日志 |
| `enable` | 设置开机自启 |
| `disable` | 取消开机自启 |
| `is-active` | 只返回状态，适合脚本判断 |
| `daemon-reload` | 修改单元文件后重载配置 |
| `list-units --type=service` | 列出所有服务 |
| `--failed` | 只列出启动失败的单元 |

## 示例

查看服务状态：

```console
$ systemctl status nginx
```

改完配置后平滑重载，不断开已有连接：

```console
$ sudo systemctl reload nginx
```

设置开机自启并立刻启动：

```console
$ sudo systemctl enable --now nginx
```

只看挂掉的单元：

```console
$ systemctl --failed
```

## 说明

- 改完 `/etc/systemd/system/*.service` 之后**必须**先执行 `systemctl daemon-reload`，否则改动不会生效。
- `restart` 会中断服务，`reload` 不会。nginx 这类支持热加载的服务优先用 `reload`。
- 单元文件里缺少 `[Install]` 段的话无法 `enable`，需要先补上。
- 老教程里的 `service nginx start` 和 `chkconfig` 在 systemd 系统上会被转发到 systemctl，写新脚本时直接用 systemctl 更清楚。
