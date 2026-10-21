---
name: tree
title: tree
description: 树形结构列出目录
category: 文件与目录
summary: 树形结构列出目录
tags: [目录, 结构, 查看]
---

## 它做什么

用树形图递归展示目录结构，一眼看清层级关系。多数发行版需要额外安装。

## 用法

```console
tree [选项] [目录]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-a` | 显示隐藏文件 |
| `-d` | 只显示目录 |
| `-L 层数` | 限制显示深度 |
| `-h` | 显示文件大小 |
| `-I 模式` | 排除匹配的内容 |
| `-f` | 显示完整路径前缀 |

## 示例

只看两层：

```console
$ tree -L 2 src
```

只看目录，并排除依赖和版本控制目录：

```console
$ tree -d -I "node_modules|.git" .
```

## 说明

- 默认没装，用 `apt install tree` 或 `dnf install tree` 装上。
- 装不了时可以用 `find . -print | sed 's|[^/]*/|  |g'` 临时顶一下，或者直接装 `lsd --tree`。
- `-I` 用竖线分隔多个排除模式，模式要用引号包起来。
