---
name: crontab
title: crontab
description: 管理定时任务
category: 进程与系统
summary: 管理定时任务
tags: [定时, 计划任务, 自动化]
---

## 它做什么

配置 cron 守护进程执行的定时任务。备份、清理日志、定时同步这些都靠它。

## 用法

```console
crontab [选项]
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-e` | 编辑当前用户的任务表 |
| `-l` | 列出当前任务 |
| `-r` | 删除全部任务（慎用） |
| `-u 用户` | 操作指定用户的任务表，需 root |

## 时间表达式

```
┌───── 分钟 (0-59)
│ ┌───── 小时 (0-23)
│ │ ┌───── 日 (1-31)
│ │ │ ┌───── 月 (1-12)
│ │ │ │ ┌───── 星期 (0-7，0 和 7 都是周日)
│ │ │ │ │
* * * * *  要执行的命令
```

特殊写法：`@daily`、`@hourly`、`@weekly`、`@reboot`（开机执行一次）。

## 示例

每天凌晨 2 点备份：

```console
0 2 * * * /usr/local/bin/backup.sh
```

每 10 分钟检查一次服务是否存活：

```console
*/10 * * * * systemctl is-active nginx || systemctl restart nginx
```

每周日凌晨清理临时文件：

```console
0 3 * * 0 find /tmp -type f -mtime +7 -delete
```

## 说明

- **任务里的命令要用绝对路径。** cron 的执行环境 PATH 很精简，`nginx` 这种命令很可能找不到，要写 `/usr/sbin/nginx`。
- 输出默认会发邮件给本机用户，通常发不出去。稳妥做法是在任务里重定向：`... >> /var/log/cron.log 2>&1`。
- 改完不用重启任何服务，cron 会自动检测到 crontab 文件的变化。`crontab -e` 保存时会检查语法。
- 系统级任务写在 `/etc/crontab` 或 `/etc/cron.d/` 里，格式多一个用户字段。
