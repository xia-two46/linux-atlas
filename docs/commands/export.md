---
name: export
title: export
description: 设置环境变量并导出给子进程
category: Shell 与脚本
summary: 设置环境变量并导出给子进程
tags: [环境变量, PATH, 配置]
---

## 它做什么

把一个变量标记为"导出"，使它对该 shell 启动的所有子进程可见。不加 `export` 的变量只在当前 shell 里有效。

## 用法

```console
export 变量名=值
export -p        # 列出所有已导出的变量
unset 变量名     # 删除
```

## 常见用处

```console
export PATH=$PATH:/opt/app/bin
export EDITOR=vim
export LANG=en_US.UTF-8
export JAVA_HOME=/usr/lib/jvm/java-17
export http_proxy=http://127.0.0.1:7890
```

## 示例

把自定义目录加进 PATH，让里面的命令可以直接运行：

```console
$ export PATH="$PATH:$HOME/.local/bin"
```

临时给某条命令指定代理：

```console
$ export https_proxy=http://127.0.0.1:7890 && curl -I https://example.com
```

**永久生效**：

```console
$ echo 'export PATH="$PATH:$HOME/.local/bin"' >> ~/.bashrc
$ source ~/.bashrc
```

## 说明

- `VAR=x` 只是当前 shell 的变量；`export VAR=x` 才会传给子进程。写脚本时如果变量没传进被调用的程序，多半是漏了 export。
- 改 PATH 时**一定要带上原来的 `$PATH`**，写成 `export PATH=/new/bin` 会让所有命令都找不到了。
- 只对一条命令临时生效的写法：`HTTPS_PROXY=... curl https://example.com`（写在命令前面）。
- 查看所有环境变量用 `env`，查看当前 shell 全部变量（含未导出的）用 `set`。
