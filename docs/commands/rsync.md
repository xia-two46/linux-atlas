---
name: rsync
title: rsync
description: 增量同步文件与目录
category: 网络
summary: 增量同步文件与目录
tags: [同步, 备份, 增量]
---

## 它做什么

在本地或主机之间同步文件，**只传输有差异的部分**。第二次跑同样的命令通常瞬间完成，这是它碾压 scp 的地方。部署静态站最标准的手段。

## 用法

```console
rsync [选项] 源 目标
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-a` | 归档模式，保留权限、时间戳、符号链接，递归同步 |
| `-v` | 显示详细过程 |
| `-z` | 传输时压缩 |
| `-P` | 显示进度，且支持断点续传 |
| `--delete` | 删除目标端源端已没有的文件 |
| `--exclude=模式` | 排除匹配的内容 |
| `-n` | 演习模式，只显示会做什么，不真干 |
| `-e 'ssh -p 2222'` | 指定远程 shell 与端口 |

## 示例

本地目录同步：

```console
$ rsync -av ./src/ ./backup/
```

把站点部署到服务器：

```console
$ rsync -avz --delete dist/ user@host:/var/www/cmdatlas/
```

排除依赖目录：

```console
$ rsync -av --exclude='node_modules' --exclude='.git' project/ backup/
```

**上线前先演习一遍**，确认不会误删：

```console
$ rsync -avn --delete dist/ user@host:/var/www/cmdatlas/
```

## 说明

- **源路径结尾的斜杠很关键**：`src/` 表示同步目录**里面的内容**，`src` 表示同步目录**本身**。部署时基本都想要带斜杠的那种。
- `--delete` 威力很大，它会让目标端和源端完全一致。用之前务必先 `-n` 演习。
- `-a` 已经包含 `-rlptgoD` 全套，不需要再单独写 `-r`。
- 常被放进 crontab 做定时异地备份。
