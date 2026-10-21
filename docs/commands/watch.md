---
name: watch
title: watch
description: 周期性重复执行一条命令
category: Shell 与脚本
summary: 周期性重复执行一条命令
tags: [监控, 定时, 刷新]
---

## 它做什么

每隔固定秒数重复执行一条命令，并全屏显示最新结果。想"盯着某个东西变化"时特别顺手。

## 用法

```console
watch [选项] 命令
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-n 秒` | 指定间隔，默认 2 秒 |
| `-d` | 高亮上一次相比发生变化的部分 |
| `-t` | 不显示标题栏 |
| `-b` | 变化时发出蜂鸣 |
| `-g` | 命令输出发生变化时才退出 |
| `-e` | 命令返回非零时退出，做告警用 |

## 示例

每 1 秒看一次内存：

```console
$ watch -n 1 free -h
```

盯目录是否被写入，并高亮变化：

```console
$ watch -d 'ls -l /tmp'
```

看服务状态：

```console
$ watch -n 5 'systemctl is-active nginx'
```

文件出现后自动退出：

```console
$ watch -g 'ls build/done 2>/dev/null' && echo "构建完成了"
```

## 说明

- **命令里有管道、重定向或通配符时要用引号包起来**，否则 shell 会在 watch 之前就先解析掉。
- `-d` 高亮差异是它的杀手锏，看数值变化时比反复手动敲命令清楚得多。
- 默认是全屏显示，会清屏。不想清屏就用 `-t` 或改用 `while` 循环。
- 想退出按 Ctrl+C。
