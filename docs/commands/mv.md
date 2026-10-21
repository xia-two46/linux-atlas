---
name: mv
title: mv
description: 移动或重命名文件
category: 文件与目录
summary: 移动或重命名文件
tags: [移动, 重命名]
---

## 它做什么

移动文件或目录，或者给它们改名。同一个分区内移动只是修改目录项，并不真的搬运数据，所以瞬间完成。

## 用法

```console
mv [选项] 源... 目标
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-i` | 覆盖前询问 |
| `-n` | 不覆盖已存在的文件 |
| `-v` | 显示移动过程 |
| `-u` | 只在源文件比目标新时才移动 |
| `-b` | 覆盖前先备份，生成 `名字~` |

## 示例

重命名：

```console
$ mv old.txt new.txt
```

把日志文件归档到别处：

```console
$ mv *.log /var/log/archive/
```

移动并改名整个目录：

```console
$ mv build/ dist/
```

覆盖前留一份备份：

```console
$ mv -b config.yaml /etc/app/config.yaml
```

## 说明

- 跨分区移动会被拆成"复制 + 删除"，大文件会明显变慢，并且要求目标分区有足够空间。
- 默认情况下覆盖已有文件不会有任何提示，重要操作建议加 `-i` 或 `-b`。
- 想批量改名，`mv` 处理不了模式替换，`rename`（Perl 版）可以用 `rename 's/\.jpeg$/.jpg/' *.jpeg` 一次搞定。
