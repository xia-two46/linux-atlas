/* =============================================================
   浏览器内伪终端
   ---------------------------------------------------------------
   一个小型的虚拟文件系统 + 命令解释器，用来让访客在点开手册前
   先亲手敲一遍。支持：

   - 可变的虚拟文件树：mkdir / touch / rm / cp / mv 都是真的在改
   - 路径解析：绝对路径、相对路径、. .. ~ 都认
   - Tab 补全（命令名与路径）、上下键历史、Ctrl+L / Ctrl+C
   - 38 条命令，覆盖查看、编辑、检索、系统信息四大类

   不依赖任何第三方库。
   ============================================================= */
(function () {
  'use strict';

  const NL = String.fromCharCode(10);

  const root = document.querySelector('[data-terminal]');
  if (!root) return;

  const body = root.querySelector('[data-terminal-body]');
  const form = root.querySelector('[data-terminal-form]');
  const input = root.querySelector('[data-terminal-input]');
  const promptEl = root.querySelector('[data-terminal-prompt]');
  if (!body || !form || !input) return;

  const esc = function (s) {
    return String(s).replace(/[&<>]/g, function (c) {
      return c === '&' ? '&amp;' : (c === '<' ? '&lt;' : '&gt;');
    });
  };

  /** 深拷贝，用于 cp 递归复制 */
  const clone = function (o) { return JSON.parse(JSON.stringify(o)); };

  const file = function (content, mode) {
    const n = { type: 'file', content: content };
    if (mode) n.mode = mode;
    return n;
  };
  const dir = function (children) { return { type: 'dir', children: children || {} }; };

  /* ------------------ 虚拟文件系统 ------------------ */
  const FS = dir({
    'readme.md': file([
      '# Linux 命令图谱',
      '',
      '这是一个运行在浏览器里的伪终端，用来演示命令的输出效果。',
      '这里的改动只存在于你的浏览器里，刷新页面即可复原。',
      '',
      '试试：pwd / ls -l / cd var/log / cat syslog / neofetch'
    ].join(NL)),
    'etc': dir({
      'os-release': file([
        'NAME="Debian GNU/Linux"',
        'VERSION_ID="12"',
        'ID=debian',
        'HOME_URL="https://www.debian.org/"'
      ].join(NL)),
      'hostname': file('cmd-atlas'),
      'hosts': file([
        '127.0.0.1       localhost',
        '::1             localhost ip6-localhost',
        '127.0.1.1       cmd-atlas'
      ].join(NL))
    }),
    'var': dir({
      'log': dir({
        'syslog': file([
          'Oct 16 09:12:01 cmd-atlas systemd[1]: Started Daily apt upgrade.',
          'Oct 16 09:12:03 cmd-atlas sshd[842]: Accepted publickey for user',
          'Oct 16 09:13:44 cmd-atlas kernel: EXT4-fs (sda1): mounted filesystem',
          'Oct 16 09:40:12 cmd-atlas nginx[1203]: reload request accepted',
          'Oct 16 10:02:55 cmd-atlas sshd[911]: Failed password for root'
        ].join(NL)),
        'nginx': dir({
          'access.log': file([
            '10.0.0.12 - - [16/Oct/2026:10:01:02 +0800] "GET / HTTP/1.1" 200 4213',
            '10.0.0.12 - - [16/Oct/2026:10:01:03 +0800] "GET /assets/style.css HTTP/1.1" 200 9182',
            '10.0.0.31 - - [16/Oct/2026:10:01:09 +0800] "GET /commands/ HTTP/1.1" 200 7331',
            '10.0.0.31 - - [16/Oct/2026:10:01:14 +0800] "GET /commands/grep/ HTTP/1.1" 200 8410',
            '10.0.0.55 - - [16/Oct/2026:10:02:41 +0800] "GET /nope HTTP/1.1" 404 1204'
          ].join(NL)),
          'error.log': file([
            '2026/10/16 09:59:58 [notice] 1203#1203: nginx/1.24.0',
            '2026/10/16 10:00:01 [notice] 1203#1203: start worker processes',
            '2026/10/16 10:02:41 [error] 1209#1209: *3 open() "/var/www/cmdatlas/nope" failed (2: No such file or directory)'
          ].join(NL))
        })
      })
    }),
    'home': dir({
      'user': dir({
        'notes.txt': file([
          '买菜清单',
          '- 咖啡豆',
          '- 挂耳滤纸',
          '',
          '待办：把 nginx 的 gzip 打开'
        ].join(NL)),
        'projects': dir({
          'atlas': dir({
            'build.sh': file('#!/bin/sh' + NL + 'nginx -t && systemctl reload nginx', '755'),
            'README.md': file('# atlas' + NL + NL + '静态站点的源码。')
          }),
          'todo.md': file('- [x] 写完 README' + NL + '- [ ] 部署到服务器')
        })
      })
    })
  });

  let cwd = ['home', 'user'];
  const history = [];
  let historyIndex = -1;
  const startedAt = Date.now();
  const HOME = ['home', 'user'];

  const modeOf = function (node) {
    if (node.mode) return node.mode;
    return node.type === 'dir' ? '755' : '644';
  };

  const linkCount = function (node) { return node.type === 'dir' ? Object.keys(node.children).length + 2 : 1; };

  /* ------------------ 路径解析 ------------------ */
  function resolvePath(input) {
    let parts;
    if (!input || input === '~') return HOME.slice();
    if (input === '/') return [];
    if (input.indexOf('~/') === 0) parts = HOME.concat(input.slice(2).split('/'));
    else if (input.indexOf('/') === 0) parts = input.split('/');
    else parts = cwd.concat(input.split('/'));

    const stack = [];
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (!p || p === '.') continue;
      if (p === '..') { stack.pop(); continue; }
      stack.push(p);
    }
    return stack;
  }

  function getNode(parts) {
    let node = FS;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (!node || node.type !== 'dir' || !node.children[p]) return null;
      node = node.children[p];
    }
    return node;
  }

  /** 定位到目标，同时返回它的父节点，便于增删改 */
  function locate(target) {
    const parts = resolvePath(target);
    if (parts.length === 0) return { parent: null, name: '/', parts: parts, node: FS };
    const name = parts[parts.length - 1];
    const parent = getNode(parts.slice(0, -1));
    return {
      parent: parent,
      name: name,
      parts: parts,
      node: (parent && parent.type === 'dir') ? parent.children[name] : null
    };
  }

  function pathString(parts) {
    if (parts.length === 0) return '/';
    if (parts.length <= 2 && parts[0] === 'home' && parts[1] === 'user') {
      return parts.length > 2 ? '~/' + parts.slice(2).join('/') : '~';
    }
    return '/' + parts.join('/');
  }

  /** 取一个还不存在的名字，用于 cp 时自动编号 */
  function uniqueName(parent, base) {
    let n = base, i = 1;
    while (parent.children[n]) { i++; n = base + i; }
    return n;
  }

  /** 简易通配符匹配，只支持一个 * */
  function globMatch(pattern, str) {
    const star = pattern.indexOf('*');
    if (star === -1) return pattern === str;
    const before = pattern.slice(0, star);
    const after = pattern.slice(star + 1);
    if (str.indexOf(before) !== 0 && before !== '') return false;
    if (after === '') return true;
    if (str.length < before.length + after.length) return false;
    return str.slice(str.length - after.length) === after;
  }

  /* ------------------ 输出 ------------------ */
  function out(text, cls) {
    const line = document.createElement('div');
    line.className = 'term-line' + (cls ? ' ' + cls : '');
    line.innerHTML = text === '' ? '&nbsp;' : esc(text);
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  function outRaw(html, cls) {
    const line = document.createElement('div');
    line.className = 'term-line' + (cls ? ' ' + cls : '');
    line.innerHTML = html;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  function echoCommand(text) {
    outRaw('<span class="term-prompt">user@atlas:' + esc(pathString(cwd)) + '$</span> ' + esc(text));
  }

  function err(msg) { out(msg, 'term-err'); }

  function needArg(args, usage) {
    if (!args.length) { err(usage); return true; }
    return false;
  }

  /** 读文件为行数组 */
  function readLines(target) {
    const hit = locate(target);
    if (!hit.node) { err(target + ': 没有那个文件或目录'); return null; }
    if (hit.node.type === 'dir') { err(target + ': 是一个目录'); return null; }
    return hit.node.content.split(NL);
  }

  function dirColor(name, node) {
    return node.type === 'dir'
      ? '<span style="color:var(--accent)">' + esc(name + '/') + '</span>'
      : esc(name);
  }

  /* ------------------ 命令实现 ------------------ */
  const NEOFETCH = [
    '       _,met$$$$$gg.          user@cmd-atlas',
    '    ,g$$$$$$$$$$$$$$$P.       ---------------',
    '  ,g$$P""       """Y$$.".     OS: Debian GNU/Linux 12 (bookworm)',
    ' ,$$P\'              `$$$.     Kernel: 6.1.0-18-amd64',
    '\',$$P       ,ggs.     `$$b:   Shell: bash 5.2.15',
    '`d$$\'     ,$P"\'   .    $$$    Terminal: 浏览器内伪终端',
    ' $$P      d$\'     ,    $$P    CPU: 虚拟化示范用 CPU @ 2.40GHz',
    ' $$:      $$.   -    ,d$$\'    Memory: 1024MiB / 3948MiB',
    ' $$;      Y$b._   _,d$P\'      Uptime: 42 days, 6 hours',
    ' Y$$.    `.`"Y$$$$P"\'\n',
    ' `$$b      "-.__'
  ].join(NL);

  const ATLAS = window.ATLAS_COMMANDS || [];
  const atlasOf = function (name) {
    for (let i = 0; i < ATLAS.length; i++) if (ATLAS[i].n === name) return ATLAS[i];
    return null;
  };

  const COMMANDS = {

    help: function () {
      outRaw([
        '<span class="term-banner">文件浏览</span>  <code>ls</code> <code>cd</code> <code>pwd</code> <code>cat</code> <code>tree</code> <code>head</code> <code>tail</code> <code>stat</code>',
        '<span class="term-banner">文件操作</span>  <code>mkdir</code> <code>touch</code> <code>cp</code> <code>mv</code> <code>rm</code> <code>chmod</code>',
        '<span class="term-banner">检索处理</span>  <code>grep</code> <code>find</code> <code>sort</code> <code>uniq</code> <code>wc</code>',
        '<span class="term-banner">系统信息</span>  <code>ps</code> <code>free</code> <code>df</code> <code>du</code> <code>uptime</code> <code>ip</code> <code>ping</code> <code>env</code> <code>which</code>',
        '<span class="term-banner">其他</span>      <code>echo</code> <code>date</code> <code>whoami</code> <code>hostname</code> <code>uname</code> <code>history</code> <code>man</code> <code>neofetch</code> <code>clear</code>'
      ].join('<br>'));
      out('Tab 补全 · ↑↓ 历史 · Ctrl+L 清屏。改动只在本页内存里，刷新即复原。', 'term-hint');
    },

    /* ---- 浏览 ---- */
    ls: function (args) {
      const target = args.filter(function (a) { return a.charAt(0) !== '-'; })[0];
      const parts = resolvePath(target || '.');
      const node = getNode(parts);
      if (!node) { err('ls: 无法访问 ' + (target || '.') + ': 没有那个文件或目录'); return; }
      if (node.type === 'file') { out(target); return; }
      const names = Object.keys(node.children).sort();
      if (!names.length) return;

      const longMode = args.indexOf('-l') !== -1 || args.indexOf('-la') !== -1 || args.indexOf('-al') !== -1;
      const showAll = args.indexOf('-a') !== -1 || args.indexOf('-la') !== -1 || args.indexOf('-al') !== -1;

      let list = names;
      if (showAll) list = ['.', '..'].concat(names);
      if (!longMode) {
        outRaw(list.map(function (n) {
          if (n === '.' || n === '..') return '<span style="color:var(--accent)">' + n + '</span>';
          return dirColor(n, node.children[n]);
        }).join('   '));
        return;
      }
      out('总用量 ' + list.length * 4);
      list.forEach(function (n) {
        const child = n === '.' || n === '..' ? null : node.children[n];
        const isDir = !child || child.type === 'dir';
        const mode = child ? modeOf(child) : '755';
        const perms = isDir ? 'd' : '-';
        const permStr = perms + 'rwxr-xr-x'.slice(0, 9);
        const size = isDir ? 4096 : Math.max(12, child.content.length * 3);
        outRaw(permStr + '  ' + String(linkCount(child || dir({}))).padStart(2) + ' user user ' +
          String(size).padStart(6) + ' Oct 16 09:10 ' +
          '<span style="color:var(--text-mute)">' + mode + '</span>  ' +
          (isDir ? '<span style="color:var(--accent)">' + esc(n + '/') + '</span>' : esc(n)));
      });
    },

    cd: function (args) {
      const target = args[0] || '~';
      const parts = resolvePath(target);
      const node = getNode(parts);
      if (!node) { err('cd: ' + target + ': 没有那个文件或目录'); return; }
      if (node.type !== 'dir') { err('cd: ' + target + ': 不是一个目录'); return; }
      cwd = parts;
      updatePrompt();
    },

    pwd: function () { out(pathString(cwd)); },

    cat: function (args) {
      if (needArg(args, 'cat: 缺少操作数')) return;
      args.forEach(function (a) {
        const lines = readLines(a);
        if (lines) lines.forEach(function (l) { out(l, 'term-out'); });
      });
    },

    head: function (args) {
      let n = 10;
      const targets = [];
      args.forEach(function (a) {
        const m = a.match(/^-n(\d+)$/);
        if (m) n = parseInt(m[1], 10);
        else if (a !== '-n') targets.push(a);
      });
      if (needArg(targets, 'head: 缺少操作数')) return;
      readLines(targets[0]).slice(0, n).forEach(function (l) { out(l, 'term-out'); });
    },

    tail: function (args) {
      let n = 10;
      const targets = [];
      args.forEach(function (a) {
        if (a === '-f' || a === '-F') { out('tail: 这里是静态演示，跟随模式不可用', 'term-hint'); return; }
        const m = a.match(/^-n(\d+)$/);
        if (m) n = parseInt(m[1], 10);
        else if (a !== '-n') targets.push(a);
      });
      if (needArg(targets, 'tail: 缺少操作数')) return;
      const lines = readLines(targets[0]);
      lines.slice(Math.max(0, lines.length - n)).forEach(function (l) { out(l, 'term-out'); });
    },

    tree: function () {
      const start = getNode(cwd);
      if (!start) return;
      out('.');
      (function walk(node, prefix) {
        const names = Object.keys(node.children).sort();
        names.forEach(function (n, i) {
          const last = i === names.length - 1;
          const child = node.children[n];
          outRaw(prefix + (last ? '└── ' : '├── ') + dirColor(n, child));
          if (child.type === 'dir') walk(child, prefix + (last ? '    ' : '│   '));
        });
      })(start, '');
    },

    stat: function (args) {
      if (needArg(args, 'stat: 缺少操作数')) return;
      const hit = locate(args[0]);
      if (!hit.node) { err('stat: 无法获取 ' + args[0] + ': 没有那个文件或目录'); return; }
      const node = hit.node;
      const size = node.type === 'dir' ? 4096 : node.content.length;
      const isDir = node.type === 'dir';
      outRaw('  文件: ' + esc(hit.name) + (isDir ? '/' : ''));
      outRaw('  大小: ' + size + '        \t类型: ' + (isDir ? '目录' : '普通文件'));
      outRaw('  权限: ' + modeOf(node) + '        链接数: ' + linkCount(node));
      outRaw('  属主: user        属组: user');
      outRaw('  修改: 2026-10-16 09:10:00');
    },

    /* ---- 文件操作 ---- */
    mkdir: function (args) {
      const recursive = args.indexOf('-p') !== -1;
      const targets = args.filter(function (a) { return a.charAt(0) !== '-'; });
      if (needArg(targets, 'mkdir: 缺少操作数')) return;
      targets.forEach(function (t) {
        if (recursive) {
          let cur = FS;
          resolvePath(t).forEach(function (seg) {
            if (!cur.children[seg]) cur.children[seg] = dir({});
            cur = cur.children[seg];
          });
          return;
        }
        const hit = locate(t);
        if (hit.node) { err('mkdir: 无法创建目录 ' + t + ': 文件已存在'); return; }
        if (!hit.parent || hit.parent.type !== 'dir') { err('mkdir: 无法创建目录 ' + t + ': 没有那个文件或目录'); return; }
        hit.parent.children[hit.name] = dir({});
      });
    },

    touch: function (args) {
      const targets = args.filter(function (a) { return a.charAt(0) !== '-'; });
      if (needArg(targets, 'touch: 缺少操作数')) return;
      targets.forEach(function (t) {
        const hit = locate(t);
        if (hit.node) return;
        if (!hit.parent || hit.parent.type !== 'dir') { err('touch: 无法创建 ' + t + ': 没有那个文件或目录'); return; }
        hit.parent.children[hit.name] = file('');
      });
    },

    rm: function (args) {
      const recursive = args.indexOf('-r') !== -1 || args.indexOf('-rf') !== -1 || args.indexOf('-fr') !== -1;
      const force = args.indexOf('-f') !== -1 || args.indexOf('-rf') !== -1 || args.indexOf('-fr') !== -1;
      const targets = args.filter(function (a) { return a.charAt(0) !== '-'; });
      if (!targets.length) { if (!force) err('rm: 缺少操作数'); return; }
      targets.forEach(function (t) {
        const hit = locate(t);
        if (!hit.node) { if (!force) err('rm: 无法删除 ' + t + ': 没有那个文件或目录'); return; }
        if (hit.node.type === 'dir' && !recursive) { err('rm: 无法删除 ' + t + ': 是一个目录'); return; }
        if (t === '/') { err('rm: 拒绝删除根目录（--preserve-root）'); return; }
        delete hit.parent.children[hit.name];
      });
    },

    cp: function (args) {
      const recursive = args.indexOf('-r') !== -1 || args.indexOf('-R') !== -1;
      const targets = args.filter(function (a) { return a.charAt(0) !== '-'; });
      if (targets.length < 2) { err('cp: 需要源和目标两个参数'); return; }
      const srcHit = locate(targets[0]);
      if (!srcHit.node) { err('cp: 无法获取 ' + targets[0] + ': 没有那个文件或目录'); return; }
      if (srcHit.node.type === 'dir' && !recursive) { err('cp: 略过目录 ' + targets[0] + '（要递归请加 -r）'); return; }

      const dstParts = resolvePath(targets[1]);
      let dstNode = getNode(dstParts);
      let dstName = dstParts[dstParts.length - 1];

      if (dstNode && dstNode.type === 'dir') {
        dstNode.children[dstName = srcHit.name in dstNode.children ? uniqueName(dstNode, srcHit.name + '-副本') : srcHit.name] = clone(srcHit.node);
        return;
      }
      const dstHit = locate(targets[1]);
      if (!dstHit.parent || dstHit.parent.type !== 'dir') { err('cp: 无法写入 ' + targets[1] + ': 没有那个目录'); return; }
      dstHit.parent.children[dstHit.name] = clone(srcHit.node);
    },

    mv: function (args) {
      const targets = args.filter(function (a) { return a.charAt(0) !== '-'; });
      if (targets.length < 2) { err('mv: 需要源和目标两个参数'); return; }
      const srcHit = locate(targets[0]);
      if (!srcHit.node) { err('mv: 无法获取 ' + targets[0] + ': 没有那个文件或目录'); return; }

      const dstParts = resolvePath(targets[1]);
      const dstNode = getNode(dstParts);
      if (dstNode && dstNode.type === 'dir') {
        dstNode.children[srcHit.name] = srcHit.node;
        delete srcHit.parent.children[srcHit.name];
        return;
      }
      const dstHit = locate(targets[1]);
      if (!dstHit.parent || dstHit.parent.type !== 'dir') { err('mv: 无法移动到 ' + targets[1] + ': 没有那个目录'); return; }
      dstHit.parent.children[dstHit.name] = srcHit.node;
      delete srcHit.parent.children[srcHit.name];
    },

    chmod: function (args) {
      const targets = args.slice(1);
      if (args.length < 2) { err('用法：chmod <权限> <文件>，例如 chmod 600 key.pem'); return; }
      const mode = args[0];
      if (!/^[0-7]{3}$/.test(mode)) { err('chmod: 无效模式 ' + mode + '（应为三位八进制数，如 644）'); return; }
      targets.forEach(function (t) {
        const hit = locate(t);
        if (!hit.node) { err('chmod: 无法访问 ' + t + ': 没有那个文件或目录'); return; }
        hit.node.mode = mode;
        out(t + ' 的权限已改为 ' + mode, 'term-out');
      });
    },

    /* ---- 检索处理 ---- */
    grep: function (args) {
      if (args.length < 2) { err('用法：grep <模式> <文件>'); return; }
      const pattern = args[0];
      const lines = readLines(args[1]);
      if (!lines) return;
      lines.filter(function (l) { return l.indexOf(pattern) !== -1; }).forEach(function (l) {
        outRaw(esc(l).split(pattern).join('<span style="background:var(--accent-soft);color:var(--accent)">' + esc(pattern) + '</span>'));
      });
    },

    find: function (args) {
      let start = cwd, pattern = null, type = null;
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-name') { pattern = args[i + 1]; i++; }
        else if (args[i] === '-type') { type = args[i + 1]; i++; }
        else if (args[i].charAt(0) !== '-') start = resolvePath(args[i]);
      }
      const base = '/' + (start.length ? start.join('/') : '');
      (function walk(node, path) {
        Object.keys(node.children).sort().forEach(function (n) {
          const child = node.children[n];
          const p = (path === '/' ? '' : path) + '/' + n;
          let ok = true;
          if (pattern && !globMatch(pattern, n)) ok = false;
          if (type === 'f' && child.type !== 'file') ok = false;
          if (type === 'd' && child.type !== 'dir') ok = false;
          if (ok) out(p);
          if (child.type === 'dir') walk(child, p);
        });
      })(getNode(start) || FS, base);
      out('', 'term-hint');
      out('搜索起点：' + (start.length ? pathString(start) : '/'), 'term-hint');
    },

    sort: function (args) {
      const opts = { r: args.indexOf('-r') !== -1, u: args.indexOf('-u') !== -1 };
      const targets = args.filter(function (a) { return a.charAt(0) !== '-'; });
      const lines = targets.length ? readLines(targets[0]) : [];
      if (targets.length && !lines) return;
      let result = lines.slice().sort();
      if (opts.r) result.reverse();
      if (opts.u) result = result.filter(function (l, i) { return i === 0 || l !== result[i - 1]; });
      result.forEach(function (l) { out(l, 'term-out'); });
    },

    uniq: function (args) {
      const countMode = args.indexOf('-c') !== -1;
      const targets = args.filter(function (a) { return a.charAt(0) !== '-'; });
      const lines = readLines(targets[0] || 'notes.txt');
      if (!lines) return;
      const groups = [];
      lines.forEach(function (l) {
        if (groups.length && groups[groups.length - 1].v === l) groups[groups.length - 1].n++;
        else groups.push({ v: l, n: 1 });
      });
      groups.forEach(function (g) {
        outRaw(countMode
          ? String(g.n).padStart(4) + '  ' + esc(g.v)
          : esc(g.v));
      });
    },

    wc: function (args) {
      const lines = readLines(args[0]);
      if (!lines) return;
      const words = lines.join(' ').split(/\s+/).filter(function (x) { return x.length; }).length;
      const bytes = lines.join(NL).length;
      out(lines.length + ' ' + words + ' ' + bytes + ' ' + args[0]);
    },

    /* ---- 系统信息 ---- */
    ps: function () {
      outRaw('USER       PID %CPU %MEM COMMAND');
      [
        ['root', '  1', '0.0', '0.3', '/sbin/init'],
        ['root', '842', '0.0', '0.5', '/usr/sbin/sshd -D'],
        ['root', '1203', '0.1', '1.2', 'nginx: master process /usr/sbin/nginx'],
        ['www-data', '1209', '0.2', '0.8', 'nginx: worker process'],
        ['root', '2264', '0.0', '0.6', '-bash'],
        ['user', '2310', '0.0', '0.4', 'ps aux']
      ].forEach(function (r) { outRaw(r.join('  ')); });
    },

    free: function (args) {
      const human = args.indexOf('-h') !== -1;
      outRaw('               total        used        free      shared  buff/cache   available');
      if (human) {
        outRaw('Mem:           3.8Gi       1.2Gi       412Mi        19Mi       2.2Gi       2.3Gi');
        outRaw('Swap:          2.0Gi          0B       2.0Gi');
      } else {
        outRaw('Mem:        4042752     1270784      417792       19456     2349056     2416640');
        outRaw('Swap:       2097152           0     2097152');
      }
      out('（演示数据。加 -h 显示人类可读单位）', 'term-hint');
    },

    df: function () {
      outRaw('Filesystem      Size  Used Avail Use% Mounted on');
      outRaw('/dev/sda1        40G   18G   20G  48% /');
      outRaw('tmpfs           3.9G     0  3.9G   0% /dev/shm');
      outRaw('/dev/sdb1       100G   61G   34G  65% /mnt/data');
    },

    du: function (args) {
      const human = args.indexOf('-h') !== -1;
      const hit = locate(args.filter(function (a) { return a.charAt(0) !== '-'; })[0] || '.');
      const node = hit.node || getNode(cwd);
      if (!node) { err('du: 没有那个目录'); return; }
      if (node.type === 'dir') {
        Object.keys(node.children).sort().forEach(function (n) {
          const child = node.children[n];
          const s = child.type === 'dir' ? 4096 : Math.max(12, child.content.length * 3);
          out((human ? Math.max(4, Math.round(s / 1024)) + 'K' : String(s)) + '\t' + n);
        });
      } else {
        out((human ? node.content.length + 'B' : String(node.content.length)) + '\t' + (hit.name));
      }
    },

    uptime: function () {
      const sec = Math.floor((Date.now() - startedAt) / 1000);
      const min = Math.floor(sec / 60);
      out('当前会话已运行 ' + (min < 1 ? sec + ' 秒' : min + ' 分 ' + (sec % 60) + ' 秒') +
        '（这是伪终端自己的计时）');
      out(' 17:20:31 up 42 days,  6:12,  2 users,  load average: 0.08, 0.03, 0.01', 'term-out');
    },

    ip: function (args) {
      if (args[0] === 'route' || args[0] === 'r') {
        out('default via 10.0.0.1 dev eth0 proto dhcp');
        out('10.0.0.0/24 dev eth0 proto kernel scope link src 10.0.0.5');
        return;
      }
      outRaw('1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 65536');
      outRaw('    inet 127.0.0.1/8 scope host lo');
      outRaw('2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500');
      outRaw('    inet 10.0.0.5/24 brd 10.0.0.255 scope global eth0');
    },

    ping: function (args) {
      let count = 4;
      const idx = args.indexOf('-c');
      if (idx !== -1 && args[idx + 1]) count = parseInt(args[idx + 1], 10);
      const host = args.filter(function (a) { return a.charAt(0) !== '-' && isNaN(parseInt(a, 10)); })[0] || 'example.com';
      const ip = '93.184.216.34';
      out('PING ' + host + ' (' + ip + ') 56(84) bytes of data.');
      let total = 0;
      for (let i = 1; i <= count; i++) {
        const t = (11 + ((i * 37) % 23) * 0.1).toFixed(1);
        total += parseFloat(t);
        out('64 bytes from ' + ip + ': icmp_seq=' + i + ' ttl=56 time=' + t + ' ms');
      }
      out('');
      out('--- ' + host + ' ping statistics ---', 'term-out');
      out(count + ' packets transmitted, ' + count + ' received, 0% packet loss', 'term-out');
      out('（演示输出，并非真实网络请求）', 'term-hint');
    },

    env: function () {
      ['SHELL=/bin/bash', 'USER=user', 'HOME=/home/user', 'PATH=/usr/local/bin:/usr/bin:/bin',
        'LANG=zh_CN.UTF-8', 'TERM=xterm-256color', 'PWD=' + pathString(cwd), 'EDITOR=vim'
      ].forEach(function (e) { out(e, 'term-out'); });
    },

    which: function (args) {
      if (needArg(args, '用法：which <命令>')) return;
      args.forEach(function (n) {
        if (COMMANDS[n]) out('/usr/bin/' + n, 'term-out');
        else if (atlasOf(n)) out(n + ': 本站收录了该命令，但本终端只有演示实现', 'term-hint');
        else err('which: 未找到 ' + n);
      });
    },

    hostname: function () { out('cmd-atlas'); },
    whoami: function () { out('user'); },

    date: function () { out(new Date().toString().split(' (')[0]); },

    uname: function (args) {
      out(args.indexOf('-a') !== -1
        ? 'Linux cmd-atlas 6.1.0-18-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux'
        : 'Linux');
    },

    echo: function (args) { out(args.join(' ')); },

    history: function () {
      history.forEach(function (h, i) { outRaw(String(i + 1).padStart(4) + '  ' + esc(h)); });
    },

    man: function (args) {
      if (needArg(args, '用法：man <命令>，例如 man grep')) return;
      const entry = atlasOf(args[0]);
      if (!entry) { err('没有 ' + args[0] + ' 的手册页条目'); return; }
      out('NAME', 'term-banner');
      out('    ' + entry.n + ' —— ' + entry.s, 'term-out');
      out('', 'term-out');
      outRaw('本站有完整条目：<a href="' + entry.u + '">' + esc(entry.u) + '</a>');
    },

    sudo: function () { err('user 不在 sudoers 文件中。此事将被报告。'); },

    neofetch: function () {
      NEOFETCH.split(NL).forEach(function (l) { out(l, 'term-out'); });
    },

    clear: function () { body.innerHTML = ''; }
  };

  function updatePrompt() {
    if (promptEl) promptEl.textContent = 'user@atlas:' + pathString(cwd) + '$';
  }

  /** 像真实 shell 那样剥掉外层引号 */
  function unquote(s) {
    if (s.length >= 2) {
      const a = s.charAt(0);
      const b = s.charAt(s.length - 1);
      if ((a === '"' && b === '"') || (a === "'" && b === "'")) return s.slice(1, -1);
    }
    return s;
  }

  function run(raw) {
    const line = raw.trim();
    echoCommand(line);
    if (!line) return;

    history.push(line);
    historyIndex = history.length;

    const tokens = line.split(' ').filter(function (t) { return t.length; });
    const name = tokens[0];
    const args = tokens.slice(1).map(unquote);

    if (COMMANDS[name]) {
      try { COMMANDS[name](args); }
      catch (e) { err('内部错误：' + e.message); }
      return;
    }

    const entry = atlasOf(name);
    if (entry) {
      out(name + '：本站收录了该命令（' + entry.s + '）', 'term-out');
      outRaw('这里只是演示用的伪终端，完整用法见 <a href="' + entry.u + '">' + esc(entry.u) + '</a>');
      return;
    }

    err('bash: ' + name + ': 未找到命令');
    out('输入 help 查看本终端支持的命令。', 'term-hint');
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    const value = input.value;
    input.value = '';
    run(value);
  });

  /* ------------------ 历史与快捷键 ------------------ */
  input.addEventListener('keydown', function (ev) {
    if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      if (historyIndex > 0) { historyIndex--; input.value = history[historyIndex]; }
    } else if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      if (historyIndex < history.length - 1) { historyIndex++; input.value = history[historyIndex]; }
      else { historyIndex = history.length; input.value = ''; }
    } else if (ev.key === 'Tab') {
      ev.preventDefault();
      complete();
    } else if (ev.key === 'l' && ev.ctrlKey) {
      ev.preventDefault();
      body.innerHTML = '';
    } else if (ev.key === 'c' && ev.ctrlKey) {
      echoCommand(input.value + '^C');
      input.value = '';
    }
  });

  /* ------------------ Tab 补全 ------------------ */
  function complete() {
    const value = input.value;
    const parts = value.split(' ');
    const isFirst = parts.length === 1;
    const fragment = parts[parts.length - 1];

    let pool;
    if (isFirst) {
      pool = Object.keys(COMMANDS).concat(ATLAS.map(function (c) { return c.n; }));
    } else {
      const node = getNode(cwd);
      pool = node && node.type === 'dir' ? Object.keys(node.children) : [];
    }

    const hits = pool.filter(function (p) { return p.indexOf(fragment) === 0; }).sort();
    if (!hits.length) return;

    if (hits.length === 1) {
      parts[parts.length - 1] = hits[0];
      input.value = parts.join(' ');
      return;
    }

    let prefix = hits[0];
    hits.forEach(function (h) {
      while (h.indexOf(prefix) !== 0) prefix = prefix.slice(0, -1);
    });
    parts[parts.length - 1] = prefix;
    input.value = parts.join(' ');
    echoCommand(value);
    outRaw(hits.map(function (h) { return esc(h); }).join('   '));
  }

  root.addEventListener('click', function (ev) {
    if (ev.target.closest('a')) return;
    if (window.getSelection && String(window.getSelection()) !== '') return;
    input.focus();
  });

  updatePrompt();
  input.focus();
})();
