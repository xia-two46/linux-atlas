---
name: chown
title: chown
description: 修改文件属主与属组
category: 权限与用户
summary: 修改文件属主与属组
tags: [权限, 属主, 归属]
---

## 它做什么

改变文件或目录的所有者和所属组。通常需要 root 权限。

## 用法

```console
chown [选项] [属主][:属组] 文件...
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-R` | 递归处理整个目录 |
| `-v` | 显示处理过程 |
| `-c` | 只显示实际发生了改动的文件 |
| `--reference=文件` | 照抄另一个文件的属主与属组 |

## 示例

改属主：

```console
$ sudo chown user report.txt
```

同时改属主和属组：

```console
$ sudo chown www-data:www-data /var/www/html
```

递归改整个站点目录：

```console
$ sudo chown -R www-data:www-data /var/www/site
```

照抄另一个文件的归属：

```console
$ sudo chown --reference=/var/www/a /var/www/b
```

## 说明

- 冒号前的属主可以省略，`:www-data` 表示只改属组。
- 只改属组也可以用独立的 `chgrp` 命令，效果和 `chown :组名` 完全一样。
- 部署网站的常见组合是：`chown -R www-data:www-data` 之后再 `chmod -R 644`，目录单独给 755。顺序反了也没关系，两者互不影响。
