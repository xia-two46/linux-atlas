---
name: history
title: history
description: 查看与复用命令历史
category: Shell 与脚本
summary: 查看与复用命令历史
tags: [历史, 效率, 快捷键]
---

## 它做什么

列出当前用户执行过的命令记录，配合编号或感叹号可以快速复用。忘记刚才那条长命令怎么敲时，比翻聊天记录快。

## 用法

```console
history [选项]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-c` | 清空当前会话的历史 |
| `-d 编号` | 删除指定某条 |
| `-a` | 把当前会话新增的历史立即写入文件 |
| `-w` | 把全部历史写进文件 |
| `-r` | 从文件重新读入历史 |

## 快速复用

| 写法 | 效果 |
| --- | --- |
| `!!` | 重跑上一条命令 |
| `!$` | 上条命令的最后一个参数 |
| `!^` | 上条命令的第一个参数 |
| `!100` | 执行编号为 100 的命令 |
| `Ctrl+R` | 交互式反向搜索，边打边匹配（最实用） |

## 示例

忘了刚才那条命令，只记得有 nginx：

```console
$ history | grep nginx
```

用 sudo 重跑上一条（忘了加 sudo 的经典救场）：

```console
$ sudo !!
```

重复上一个命令的参数：

```console
$ mkdir /tmp/test && cd !$
```

## 说明

- 历史默认存在 `~/.bash_history`（zsh 是 `~/.zsh_history`），退出 shell 时才写入，所以多个终端会话之间可能不同步。
- 想让历史立刻同步，配 `shopt -s histappend` 并把写入写进 `PROMPT_COMMAND`。
- **`Ctrl+R` 是最值得练熟的一个快捷键**，比 `history | grep` 快得多。
- 命令前面加一个空格，默认不会被记进历史（由 `HISTCONTROL=ignorespace` 控制）——临时执行带密码的命令时有用。
