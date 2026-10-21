---
name: ssh
title: ssh
description: 安全地远程登录与执行命令
category: 网络
summary: 安全地远程登录与执行命令
tags: [远程, 登录, 隧道]
featured: true
---

## 它做什么

通过加密通道登录远程主机，也可以直接在远端执行一条命令后立刻返回。

## 用法

```console
ssh [选项] [用户@]主机 [命令]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-p 端口` | 指定 SSH 端口 |
| `-i 私钥` | 指定使用的私钥文件 |
| `-L 本地端口:目标:端口` | 本地端口转发 |
| `-R 远端端口:目标:端口` | 远端端口转发 |
| `-D 端口` | 开一个 SOCKS 代理 |
| `-N` | 只建立连接不执行命令，配合端口转发使用 |
| `-f` | 转入后台运行 |
| `-v` | 显示调试信息，排错时用 `-vvv` |

## 示例

基本登录：

```console
$ ssh user@192.168.1.10
```

指定私钥和端口：

```console
$ ssh -i ~/.ssh/id_ed25519 -p 2222 user@host
```

在远端执行一条命令就返回：

```console
$ ssh user@host "systemctl status nginx"
```

把远端机器的 3306 映射到本地 13306：

```console
$ ssh -N -L 13306:127.0.0.1:3306 user@host
```

## 说明

- 常用连接可以写进 `~/.ssh/config`，例如：

  ```console
  Host web01
      HostName 192.168.1.10
      User user
      Port 2222
      IdentityFile ~/.ssh/id_ed25519
  ```

  之后直接 `ssh web01` 就行，不用每次敲全参数。
- 第一次连接会提示确认指纹，**确认过再输入 yes**，否则有中间人攻击的风险。
- 私钥权限必须是 `600`，否则 ssh 会拒绝使用它。
- 服务端建议关掉密码登录：在 `/etc/ssh/sshd_config` 里设 `PasswordAuthentication no`，改完 `systemctl reload sshd`。
