---
name: curl
title: curl
description: 发起 HTTP 请求与下载文件
category: 网络
summary: 发起 HTTP 请求与下载文件
tags: [网络, 下载, API]
featured: true
---

## 它做什么

用 URL 语法传输数据，支持 HTTP、HTTPS、FTP 等协议。它既是下载工具，也是命令行里调试接口的第一选择。

## 用法

```console
curl [选项] URL
```

## 常用选项

| 选项 | 说明 |
| --- | --- |
| `-o 文件` | 保存到指定文件 |
| `-O` | 用 URL 里的文件名保存 |
| `-L` | 跟随 3xx 重定向 |
| `-I` | 只获取响应头 |
| `-s` | 静默模式，不显示进度条 |
| `-S` | 配合 `-s`，出错时仍然显示错误信息 |
| `-v` | 显示完整的请求与响应过程 |
| `-X POST` | 指定请求方法 |
| `-H "头: 值"` | 添加请求头 |
| `-d "数据"` | 发送请求体，自动改用 POST |
| `-w "%{http_code}"` | 按格式输出信息，如状态码 |
| `--connect-timeout 秒` | 设置连接超时 |

## 示例

只看响应头：

```console
$ curl -I https://example.com
```

跟随重定向下载：

```console
$ curl -L -O https://example.com/file.tar.gz
```

调用 JSON 接口：

```console
$ curl -s -H "Content-Type: application/json" \
    -d '{"name":"test"}' https://api.example.com/v1/items
```

只取状态码，写监控脚本很好用：

```console
$ curl -s -o /dev/null -w "%{http_code}\n" https://example.com
```

测一下接口耗时：

```console
$ curl -s -o /dev/null -w "连接 %{time_connect}s  总耗时 %{time_total}s\n" https://example.com
```

## 说明

- 脚本里推荐写成 `curl -sS`，这样既不刷进度条，出错时又看得到原因。
- 下载大文件怕中断时加 `-C -`，可以从断点继续。
- 遇到自签名证书会报错。测试环境可以加 `-k` 临时绕过，生产环境应该先把证书链修好。
- 想看 TLS 握手过程，`curl -v` 会连证书信息一起打出来。
