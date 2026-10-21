---
title: 部署文档
description: 本站的实际部署教程 — 使用 GitHub Pages 免费部署
---

# 部署文档

本站实际部署在 **GitHub Pages**（免费），通过 GitHub Actions 实现「推送即上线」的自动化流程，无需购买服务器或域名。

线上地址：<https://xia-two46.github.io/linux-atlas/>

::: tip 为什么选 GitHub Pages
静态站点 + GitHub Pages 是最省心的组合：免费、免备案、自带 HTTPS、自带 CDN，而且天然和源码仓库绑定，改完代码推一下分支就自动上线。
:::

## 前置条件

- 一个 [GitHub](https://github.com) 账号
- 本地安装 [Git](https://git-scm.com/) 和 [Node.js](https://nodejs.org/)（18 及以上）
- 本地安装 [GitHub CLI](https://cli.github.com/)（`gh`，可选，用于命令行操作）

## 1. 配置 `base` 路径（关键）

GitHub Pages 的站点地址形如 `https://<用户名>.github.io/<仓库名>/`，而不是域名根目录。因此必须在 VitePress 配置里设置 `base`，否则所有资源路径会指向域名根，导致页面白屏。

在 `docs/.vitepress/config.mts` 中：

```ts
export default defineConfig({
  base: '/linux-atlas/',   // 换成你自己的仓库名
  // ...
})
```

同时把 sitemap 的 hostname 改成真实地址：

```ts
sitemap: {
  hostname: 'https://xia-two46.github.io'
}
```

## 2. 准备部署工作流

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

这个工作流做了两件事：先 `build`（安装依赖 → 构建站点 → 上传产物），再 `deploy`（把产物发布到 GitHub Pages）。

## 3. 初始化仓库并提交

```bash
# 在项目根目录
git init -b main
git add -A
git commit -m "初始提交"
```

> 建议配置 `.gitignore`，排除 `node_modules/`、`docs/.vitepress/dist/`、`docs/.vitepress/cache/` 等无需入库的文件。

## 4. 创建远程仓库并推送

用 GitHub CLI 一条命令搞定（会自动创建仓库、设置远端并推送）：

```bash
gh repo create linux-atlas --public --source=. --remote=origin --push
```

或者手动操作：先在 GitHub 网页新建仓库，然后：

```bash
git remote add origin https://github.com/<用户名>/linux-atlas.git
git push -u origin main
```

## 5. 开启 GitHub Pages

在仓库页面进入 **Settings → Pages**，将 **Build and deployment** 的 Source 设为 **GitHub Actions**。

也可以用命令行：

```bash
gh api -X POST repos/<用户名>/linux-atlas/pages -f "build_type=workflow"
```

设置完成后，推送一次 `main` 分支（或手动触发 workflow），GitHub Actions 就会自动构建并部署。

## 6. 验证

部署完成后访问 `https://<用户名>.github.io/linux-atlas/`，确认：

- [ ] 首页能正常打开，无白屏
- [ ] 图片、样式（CSS）正常加载
- [ ] 页面内链接跳转正常
- [ ] 深/浅主题切换正常

## 常见问题

| 现象 | 原因与解决 |
| --- | --- |
| 页面白屏 | 忘了设置 `base`，资源路径指向域名根。检查 `config.mts` 的 `base` 是否等于 `/<仓库名>/` |
| 404 Not Found | Pages 的 Source 未设为 GitHub Actions，或 workflow 还没跑完 |
| push 报 `unable to access` / `Connection reset` | 本地网络访问 `github.com` 不稳定（国内常见），重试或开启代理 |
| workflow 失败 | 到仓库的 **Actions** 标签页查看具体日志，常见原因是依赖未锁版本导致 `npm ci` 失败 |

## 后续更新

以后每次修改内容，只需：

```bash
git add -A
git commit -m "描述你的改动"
git push
```

推送后 GitHub Actions 会自动构建并部署，约 1 分钟后线上即更新，无需任何额外操作。
