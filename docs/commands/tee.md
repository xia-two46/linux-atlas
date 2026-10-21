---
name: tee
title: tee
description: 同时输出到屏幕与文件
category: 文本处理
summary: 同时输出到屏幕与文件
tags: [重定向, 管道, 日志]
---

## 它做什么

从标准输入读入，一边打到屏幕，一边写进文件。它就像在管道中间接了个三通阀。

## 用法

```console
命令 | tee [选项] 文件...
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-a` | 追加到文件末尾，而不是覆盖 |
| `-i` | 忽略中断信号 |
| `-p` | 诊断写入非管道时的错误 |

## 示例

一边看输出一边存档：

```console
$ make 2>&1 | tee build.log
```

关键用法——往需要 root 权限的文件里写东西：

```console
$ echo "server_tokens off;" | sudo tee -a /etc/nginx/nginx.conf
```

同时给多个文件：

```console
$ command | tee file1.txt file2.txt
```

## 说明

- **这是 `sudo` 配合重定向的标准答案。** 写成 `sudo echo x > /etc/f` 会失败，因为 `>` 的重定向是由普通用户的 shell 执行的，没有写权限。用 `tee` 接收管道再写文件，写这个动作就发生在 root 权限下了。
- `2>&1 | tee` 是把标准错误也并进管道，否则错误信息会绕过 tee 直接跑到终端上。
- 想完全静默只落盘，用 `tee file > /dev/null`。
