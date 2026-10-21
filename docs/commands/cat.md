---
name: cat
title: cat
description: 连接文件并输出内容
category: 文本处理
summary: 连接文件并输出内容
tags: [查看, 拼接, 输出]
featured: true
---

## 它做什么

名字来自 concatenate（连接）。最常见的用法是把文件内容打到标准输出，也可以把多个文件按顺序首尾相接。

## 用法

```console
cat [选项] [文件...]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-n` | 给所有行编号 |
| `-b` | 只给非空行编号 |
| `-s` | 把连续空行压缩成一行 |
| `-A` | 显示不可见字符，行尾显示 `$`，Tab 显示 `^I` |
| `-T` | 只把 Tab 显示为 `^I` |

## 示例

查看系统版本信息：

```console
$ cat /etc/os-release
NAME="Debian GNU/Linux"
VERSION_ID="12"
ID=debian
```

把分片的文件拼回去：

```console
$ cat part1.sql part2.sql > full.sql
```

带行号查看，方便指着某几行讨论：

```console
$ cat -n nginx.conf
```

## 说明

- **长文件不要用 `cat`**，输出会一下刷满屏幕。用 `less` 分页看，或者用 `head`、`tail` 看头尾。
- 检查脚本里有没有混入 Windows 换行符时 `cat -A` 很有用：行尾出现 `^M$` 就说明是 CRLF。
- 想快速建一个小文件，可以用 here document：输入 `cat > f.txt <<'EOF'`，写完内容后单独一行 `EOF` 结束。
