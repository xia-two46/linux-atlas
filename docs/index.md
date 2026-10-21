---
layout: home

hero:
  name: Linux 命令图谱
  text: 交互式命令参考手册
  tagline: 63 条高频命令 · 7 大分类 · 内置可交互的浏览器伪终端
  actions:
    - theme: brand
      text: 开始浏览命令
      link: /commands/
    - theme: alt
      text: 在线终端
      link: /commands/terminal
    - theme: alt
      text: 关于开源精神
      link: /guide/opensource

features:
  - icon: ⌨️
    title: 浏览器内伪终端
    details: 不用装 Linux 也能亲手敲命令。可变文件系统 + 命令解释器，支持 Tab 补全、历史记录，改动真实生效，刷新即复原。
  - icon: 📚
    title: 63 条命令手册
    details: 按「它做什么 → 用法 → 常用选项 → 示例 → 说明」五段式组织，每条都有可直接复制的示例与通俗的讲解。
  - icon: 🧭
    title: 7 大分类导航
    details: 文件与目录、文本处理、进程与系统、权限与用户、网络、磁盘与归档、Shell 与脚本，按用途快速定位。
  - icon: 🌏
    title: Linux 文化与开源
    details: 不止是命令字典，还有发行版介绍、开源精神与入门路线，帮你理解 Linux 背后的自由软件哲学。
  - icon: 🎨
    title: 深浅双主题
    details: 跟随系统偏好自动切换，也可以手动切换，长时间阅读不刺眼。
  - icon: 🚀
    title: 极致的性能与无障碍
    details: 静态生成、零后端，Lighthouse 性能与可访问性双 90+，语义化标签与键盘快捷键齐全。
---

<div class="hero-terminal">
  <Terminal />
</div>

## 为什么是命令图谱？

Linux 的力量在于命令行。但初学者面对黑乎乎的终端，往往被成百上千的命令劝退。这个站点想做一件事：**把命令讲人话**。

每条命令都遵循同一个结构——先讲它**做什么**，再给**用法**，然后是**常用选项**和**可直接复制的示例**，最后补充**实用的说明与坑**。你不用读完整个 man 手册，就能上手。

更重要的是，这里有一个**能真的敲命令的伪终端**。你可以先点开它，敲 `ls`、`cd var/log`、`cat syslog`，亲眼看看输出长什么样，再回头看手册里的讲解。动手，永远是学 Linux 最快的方式。

## 按用途浏览

<div class="cat-grid">
  <div class="cat-card"><h3><span class="icon">▤</span>文件与目录</h3><p>创建、查看、移动、删除与查找文件。</p></div>
  <div class="cat-card"><h3><span class="icon">▦</span>文本处理</h3><p>搜索、切分、替换与统计文本内容。</p></div>
  <div class="cat-card"><h3><span class="icon">◉</span>进程与系统</h3><p>观察和控制进程、服务以及系统信息。</p></div>
  <div class="cat-card"><h3><span class="icon">◈</span>权限与用户</h3><p>管理文件权限、归属与提权操作。</p></div>
  <div class="cat-card"><h3><span class="icon">◇</span>网络</h3><p>发起请求、远程登录与查看连接状态。</p></div>
  <div class="cat-card"><h3><span class="icon">▣</span>磁盘与归档</h3><p>查看空间占用、打包与解包文件。</p></div>
  <div class="cat-card"><h3><span class="icon">⌗</span>Shell 与脚本</h3><p>把命令串起来的管道、参数传递与历史。</p></div>
</div>

## 从这里开始

- **刚接触 Linux？** 先看 [入门路线](/guide/roadmap)，建立知识地图。
- **想了解发行版怎么选？** 看 [发行版介绍](/guide/distros)。
- **对自由软件感兴趣？** 读一读 [开源精神](/guide/opensource)。
- **已经是熟手？** 直接去 [命令手册](/commands/) 查漏补缺。
