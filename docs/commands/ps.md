---
name: ps
title: ps
description: 查看当前进程状态
category: 进程与系统
summary: 查看当前进程状态
tags: [进程, 查看, 排查]
---

## 它做什么

列出当前系统的进程快照。它显示的是**执行命令那一刻**的状态，想看动态变化要用 `top` 或 `htop`。

## 用法

```console
ps [选项]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `aux` | BSD 风格，列出所有用户的所有进程 |
| `-ef` | System V 风格，信息量与 aux 相当 |
| `-eLf` | 同时把线程列出来 |
| `-o 字段` | 自定义输出列 |
| `--sort=-%cpu` | 按 CPU 占用降序 |
| `-p PID` | 只看指定进程 |
| `-C 名字` | 按命令名筛选 |

## 示例

列出全部进程，配合 grep 找目标：

```console
$ ps aux | grep nginx
```

按内存占用排序，找出最吃内存的进程：

```console
$ ps aux --sort=-%mem | head -10
```

只看某个进程的 PID、父进程和资源占用：

```console
$ ps -o pid,ppid,%cpu,%mem,cmd -p 1234
```

用树形结构看父子关系：

```console
$ ps -ef --forest
```

## 说明

- `ps aux | grep xxx` 总会把 grep 自己也列进去。写成 `grep [x]xx` 可以避开。
- `aux` 前面**不加横线**是历史惯例。写成 `ps -aux` 在部分系统上会收到警告。
- 输出里的 `STAT` 列：`R` 正在运行、`S` 可中断睡眠、`D` 不可中断睡眠（通常卡在 IO）、`Z` 僵尸进程。
- 想看实时的资源占用，`top`（或更好用的 `htop`）比反复敲 `ps` 舒服得多。
