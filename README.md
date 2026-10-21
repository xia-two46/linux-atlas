# Linux 命令图谱（Linux Atlas）

以 **Linux 文化、技术分享与开源精神**为主题的静态网站，一份交互式 Linux 命令参考手册。基于 **VitePress（Vue 3 + Vite）** 构建。

## 特性

- **63 条命令手册**：按「它做什么 → 用法 → 常用选项 → 示例 → 说明」五段式组织，7 大分类。
- **浏览器内伪终端**：零依赖纯 JavaScript 手写的微型 shell（虚拟文件系统 + 命令解释器 + Tab 补全 + 历史记录），改动真实生效，刷新即复原。
- **Linux 文化栏目**：发行版介绍、开源精神、入门路线。
- **深浅双主题**：跟随系统偏好，可手动切换。
- **本地全文搜索**：按名称、简介、标签即时检索。
- **无障碍与 SEO**：语义化标签、sitemap、Open Graph。

## 技术栈

| 层 | 技术 |
| --- | --- |
| 框架 | VitePress（Vue 3 + Vite） |
| 亮点组件 | 自研浏览器伪终端（`terminal-core.js`，806 行零依赖） |
| 构建 | VitePress 静态生成，输出纯静态站点 |
| 部署 | Nginx + Let's Encrypt HTTPS + git push 即上线 |

## 目录结构

```
linux-atlas/
├── docs/                          # VitePress 站点根目录
│   ├── .vitepress/
│   │   ├── config.mts             # 站点配置、导航、侧边栏
│   │   ├── categories.js          # 命令分类数据
│   │   └── theme/
│   │       ├── index.ts           # 主题入口（注册组件）
│   │       ├── custom.css         # 品牌样式
│   │       └── components/
│   │           ├── Terminal.vue   # 伪终端 Vue 封装
│   │           └── terminal-core.js # 伪终端核心（零依赖）
│   ├── commands/                  # 63 条命令手册（md）
│   ├── guide/                     # Linux 文化栏目
│   ├── about/                     # 项目介绍 + 部署文档
│   ├── public/                    # 静态资源
│   └── index.md                   # 首页
├── deploy/                        # Nginx 配置等部署文件
├── .github/workflows/             # GitHub Actions CI/CD
└── scripts/                       # 辅助脚本
```

## 快速开始

需要 Node.js 18 及以上。

```bash
npm install
npm run dev      # 本地开发，http://localhost:5173
npm run build    # 构建到 docs/.vitepress/dist
npm run preview  # 预览构建产物
```

## 部署

见 [docs/about/deploy.md](docs/about/deploy.md)，包含从裸机到公网 HTTPS、git push 即上线的完整流程。

## 许可

MIT
