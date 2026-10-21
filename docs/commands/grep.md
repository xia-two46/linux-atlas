---
name: grep
title: grep
description: 按模式搜索文本内容
category: 文本处理
summary: 按模式搜索文本内容
tags: [搜索, 正则, 过滤]
featured: true
---

## 它做什么

逐行读取输入，输出匹配指定模式的行。默认是基本正则表达式（BRE），加 `-E` 后支持扩展正则（ERE）。

## 用法

```console
grep [选项] 模式 [文件...]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-i` | 忽略大小写 |
| `-v` | 反向匹配，输出**不**匹配的行 |
| `-n` | 显示行号 |
| `-r` | 递归搜索目录，也可写 `-R` |
| `-l` | 只显示包含匹配内容的文件名 |
| `-c` | 只显示每个文件匹配到的行数 |
| `-E` | 启用扩展正则，可直接用 `+` `?` 和分组括号 |
| `-F` | 把模式当固定字符串，不做正则解析 |
| `-A n` | 连同匹配行之后的 n 行一起输出 |
| `-B n` | 连同匹配行之前的 n 行一起输出 |
| `-C n` | 前后各输出 n 行 |
| `--color=auto` | 高亮匹配到的部分 |

## 示例

在配置文件里找关键词并显示行号：

```console
$ grep -n "ListenPort" /etc/ssh/sshd_config
13:#Port 22
```

递归搜索整个项目，忽略大小写：

```console
$ grep -rni "todo" ./src
```

去掉注释行和空行，只看有效配置：

```console
$ grep -v "^#" nginx.conf | grep -v "^$"
```

匹配 IP 地址这类模式要用扩展正则：

```console
$ grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" access.log
```

查看报错以及它后面 3 行：

```console
$ grep -A 3 "ERROR" /var/log/app.log
```

## 说明

- 三条最常用的组合：全项目搜索用 `grep -rni`、去掉注释和空行用 `grep -v "^#"`、统计命中数用 `grep -c`。
- 想同时匹配多个条件，用 `-e` 叠加：`grep -e error -e fail app.log`。
- 模式里有空格或特殊字符时记得加引号。
- 搜代码时 `ripgrep`（命令是 `rg`）比 `grep -r` 快一个量级，而且默认跳过 `.gitignore` 里的文件。
