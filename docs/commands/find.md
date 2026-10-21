---
name: find
title: find
description: 递归查找文件与目录
category: 文件与目录
summary: 递归查找文件与目录
tags: [查找, 搜索, 递归]
featured: true
---

## 它做什么

按名称、类型、大小、时间等条件递归查找文件，并且可以对找到的结果直接执行命令。

## 用法

```console
find [起始路径...] [表达式]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-name 模式` | 按文件名匹配，区分大小写 |
| `-iname 模式` | 同上，不区分大小写 |
| `-type f` | 只匹配普通文件；`-type d` 只匹配目录 |
| `-size +100M` | 按大小筛选，`+` 表示大于，`-` 表示小于 |
| `-mtime -7` | 按修改时间，单位是天，`-7` 表示 7 天内 |
| `-user 名字` | 按属主查找 |
| `-maxdepth 层数` | 限制递归深度 |
| `-exec 命令 {} \;` | 对每个结果执行指定命令 |
| `-delete` | 直接删除匹配到的文件 |

## 示例

按名字找配置文件：

```console
$ find /etc -name "*.conf"
/etc/nginx/nginx.conf
/etc/ssh/sshd_config
```

找出 7 天内改过、且大于 10M 的日志：

```console
$ find /var/log -type f -mtime -7 -size +10M
```

删除所有 .tmp 文件：

```console
$ find . -name "*.tmp" -type f -delete
```

给所有脚本加执行权限：

```console
$ find . -type f -name "*.sh" -exec chmod +x {} \;
```

## 说明

- 模式**必须加引号**，否则 shell 会在 find 之前就把通配符展开掉。
- `-exec` 里的 `{}` 会被替换成当前文件名，结尾的 `\;` 表示命令结束。把 `\;` 换成 `+` 可以把所有文件合并成一次调用，处理大量文件时快得多。
- 只是想按名字快速定位，`locate` 更快，但它依赖定期更新的索引数据库，新文件可能搜不到。
