import { defineConfig } from 'vitepress'

// 命令数据：从原项目的 categories.json + commands 迁移而来
import categories from './categories.js'

// 侧边栏：按分类组织命令
const commandSidebar = categories.map((c) => ({
  text: `${c.icon} ${c.name}`,
  collapsed: false,
  items: c.commands.map((cmd) => ({
    text: cmd.name,
    link: `/commands/${cmd.name}`
  }))
}))

export default defineConfig({
  lang: 'zh-CN',
  // GitHub Pages 部署：站点挂在 https://<user>.github.io/linux-atlas/ 下，
  // 必须设置 base，否则资源路径会指向域名根导致 404。
  base: '/linux-atlas/',
  title: 'Linux 命令图谱',
  description: '交互式 Linux 命令参考手册 — 收录高频命令、发行版介绍与开源精神，附浏览器内可交互的伪终端。',
  head: [
    ['meta', { name: 'theme-color', content: '#0f172a' }],
    ['link', { rel: 'icon', href: '/favicon.svg' }]
  ],
  sitemap: {
    hostname: 'https://xia-two46.github.io'
  },
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '命令手册', link: '/commands/ls' },
      {
        text: 'Linux 文化',
        items: [
          { text: '发行版介绍', link: '/guide/distros' },
          { text: '开源精神', link: '/guide/opensource' },
          { text: '入门路线', link: '/guide/roadmap' }
        ]
      },
      {
        text: '关于',
        items: [
          { text: '项目介绍', link: '/about/' },
          { text: '部署文档', link: '/about/deploy' },
          { text: '答辩演示指南', link: '/about/presentation' }
        ]
      }
    ],
    sidebar: {
      '/commands/': [
        {
          text: '快速上手',
          items: [
            { text: '命令总览', link: '/commands/' },
            { text: '在线终端', link: '/commands/terminal' }
          ]
        },
        ...commandSidebar
      ],
      '/guide/': [
        {
          text: 'Linux 文化',
          items: [
            { text: '发行版介绍', link: '/guide/distros' },
            { text: '开源精神', link: '/guide/opensource' },
            { text: '入门路线', link: '/guide/roadmap' }
          ]
        }
      ]
    },
    outline: { label: '本页目录', level: [2, 3] },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索命令', buttonAriaLabel: '搜索命令' },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除搜索',
            backButtonTitle: '返回',
            noResultsText: '没有找到相关命令',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最近更新', formatOptions: { dateStyle: 'short' } },
    footer: {
      message: '以开源之名，致敬 Linux 与自由软件精神。',
      copyright: 'Copyright © 2026 Linux Atlas'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ]
  }
})
