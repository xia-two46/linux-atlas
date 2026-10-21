// 命令分类数据：从原项目 content/categories.json + commands/*.md 迁移
// 共 63 条命令，7 个分类
export default [
  {
    name: '文件与目录',
    slug: 'files',
    icon: '▤',
    desc: '创建、查看、移动、删除与查找文件。',
    commands: [
      { name: 'ls' }, { name: 'cp' }, { name: 'mv' }, { name: 'rm' },
      { name: 'mkdir' }, { name: 'touch' }, { name: 'ln' }, { name: 'stat' },
      { name: 'file' }, { name: 'find' }, { name: 'locate' }, { name: 'tree' }
    ]
  },
  {
    name: '文本处理',
    slug: 'text',
    icon: '▦',
    desc: '搜索、切分、替换与统计文本内容。',
    commands: [
      { name: 'cat' }, { name: 'head' }, { name: 'less' }, { name: 'grep' },
      { name: 'awk' }, { name: 'sed' }, { name: 'cut' }, { name: 'sort' },
      { name: 'uniq' }, { name: 'wc' }, { name: 'diff' }, { name: 'tee' }, { name: 'tr' }
    ]
  },
  {
    name: '进程与系统',
    slug: 'process',
    icon: '◉',
    desc: '观察和控制进程、服务以及查看系统信息。',
    commands: [
      { name: 'ps' }, { name: 'top' }, { name: 'kill' }, { name: 'systemctl' },
      { name: 'journalctl' }, { name: 'crontab' }, { name: 'nohup' },
      { name: 'free' }, { name: 'uname' }, { name: 'uptime' }
    ]
  },
  {
    name: '权限与用户',
    slug: 'perm',
    icon: '◈',
    desc: '管理文件权限、归属与提权操作。',
    commands: [
      { name: 'chmod' }, { name: 'chown' }, { name: 'sudo' }, { name: 'su' },
      { name: 'id' }, { name: 'useradd' }, { name: 'usermod' }, { name: 'passwd' }
    ]
  },
  {
    name: '网络',
    slug: 'network',
    icon: '◇',
    desc: '发起请求、远程登录与查看连接状态。',
    commands: [
      { name: 'ping' }, { name: 'curl' }, { name: 'wget' }, { name: 'ssh' },
      { name: 'scp' }, { name: 'rsync' }, { name: 'ip' }, { name: 'ss' }, { name: 'dig' }
    ]
  },
  {
    name: '磁盘与归档',
    slug: 'disk',
    icon: '▣',
    desc: '查看空间占用、打包与解包文件。',
    commands: [
      { name: 'df' }, { name: 'du' }, { name: 'lsblk' }, { name: 'dd' },
      { name: 'tar' }, { name: 'zip' }
    ]
  },
  {
    name: 'Shell 与脚本',
    slug: 'shell',
    icon: '⌗',
    desc: '把命令串起来的管道、参数传递与历史记录。',
    commands: [
      { name: 'alias' }, { name: 'export' }, { name: 'history' },
      { name: 'watch' }, { name: 'xargs' }
    ]
  }
]
