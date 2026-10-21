---
name: less
title: less
description: 分页查看长文件
category: 文本处理
summary: 分页查看长文件
tags: [查看, 分页, 日志]
---

## 它做什么

分页显示文件内容，支持上下滚动与搜索，看完即退出，不会刷屏。**看日志和长文件应该用它，而不是 `cat`。**

## 用法

```console
less [选项] 文件
```

## 常用操作键

| 按键 | 作用 |
| --- | --- |
| `空格` / `f` | 向下翻一页 |
| `b` | 向上翻一页 |
| `j` / `k` 或方向键 | 向下 / 向上一行 |
| `/关键词` | 向下搜索，按 `n` 跳下一个、`N` 跳上一个 |
| `?关键词` | 向上搜索 |
| `g` / `G` | 跳到开头 / 跳到结尾 |
| `q` | 退出 |
| `F` | 进入跟随模式，等同 `tail -f`，按 Ctrl+C 退出 |

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-N` | 显示行号 |
| `-i` | 搜索时忽略大小写 |
| `-S` | 长行不自动折行，用左右箭头看 |
| `+F` | 直接以跟随模式打开 |

## 示例

看日志：

```console
$ less /var/log/nginx/error.log
```

带行号看配置文件：

```console
$ less -N nginx.conf
```

像 tail -f 一样实时跟随：

```console
$ less +F /var/log/syslog
```

## 说明

- `/var/log` 下的分页机制默认调用的就是 less，这就是为什么 `journalctl`、`man`、`git log` 翻页时的按键都一样。
- 环境变量 `LESS="-R -S"` 写进 `.bashrc` 可以让它默认保留 ANSI 颜色和横向滚动。
- 老话说 "less is more"——它确实是用来替代更早的 `more` 命令的。
