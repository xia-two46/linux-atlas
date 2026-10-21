---
name: alias
title: alias
description: 给命令起简短别名
category: Shell 与脚本
summary: 给命令起简短别名
tags: [别名, 快捷键, 效率]
---

## 它做什么

给常用命令定义一个更短的名字。当前 shell 有效，想永久生效要写进配置文件。

## 用法

```console
alias 名字='命令'
unalias 名字
```

## 常用写法

```console
alias ll='ls -lh'
alias la='ls -lah'
alias gs='git status'
alias ..='cd ..'
alias df='df -h'
alias du='du -h'
alias ports='ss -tlnp'
alias myip='curl -s ifconfig.me'
```

## 示例

定义一个：

```console
$ alias ports='ss -tlnp'
$ ports
```

查看已定义的所有别名：

```console
$ alias
```

临时取消：

```console
$ unalias ports
```

**永久生效**——写进 shell 配置文件：

```console
$ echo "alias ll='ls -lh'" >> ~/.bashrc
$ source ~/.bashrc
```

## 说明

- 等号两边**不能有空格**，这是 shell 语法的硬性要求。
- 这样定义的别名只在当前终端窗口里有效，**想永久生效必须写进** `~/.bashrc`（bash）或 `~/.zshrc`（zsh），然后 `source` 一下重新加载。
- 想绕过别名执行原版命令，在前面加反斜杠：`\ls`。
- 优先级：**函数 > 别名 > 内建命令 > 外部命令**。别名会被同名函数覆盖。
- 交互式 shell 才加载 ~/.bashrc，脚本里用别名是不生效的。
