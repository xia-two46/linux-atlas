---
title: 部署文档
description: 从裸机到公网 HTTPS 的完整部署流程
---

# 部署文档

按本文走完一遍，你会得到：一台初始化过的 Ubuntu 服务器、一个 Nginx 站点、一张 Let's Encrypt 证书，以及 `git push` 即上线的自动部署链路。

::: tip 部署能力是考察重点
本站作为「Linux 协会静态网页部署」的参赛项目，部署环节是三个核心考察点之一。本文档既是操作手册，也是答辩时的演示脚本。
:::

## 0. 先决定服务器和域名

这是最容易被忽略、却最影响工期的一步。

| 路线 | 代价 | 说明 |
| --- | --- | --- |
| **境外 VPS + 域名** | 约 20~60 元/月 | 免备案，买完就能用。**比赛首选**，工期最短 |
| 国内轻量 + 域名 | 约 10 元/月 + 备案 | 必须备案，代备案流程通常 10~20 个工作日 |
| 国内轻量，不绑域名 | 约 10 元/月 | 只能用 `http://IP` 访问，没法上 HTTPS |

具体建议：

- **境外**：RackNerd、Vultr、DigitalOcean 的低配机（1C1G 足够静态站），或 Oracle Cloud 的永久免费 ARM 机。
- **国内**：腾讯云 / 阿里云的**轻量应用服务器**，学生认证后约 10 元/月。
- **域名**：`.xyz` / `.top` 首年约 10 元；不想花钱可用 DuckDNS 免费二级域名。
- 系统镜像一律选 **Ubuntu 24.04 LTS**。

## 1. 首次登录与初始化

```bash
# 本地：用密钥登录
ssh-copy-id root@你的服务器IP
ssh root@你的服务器IP
```

```bash
# —— 以下在服务器上执行 ——
# 1. 更新系统
apt update && apt upgrade -y

# 2. 建日常用的 sudo 用户
adduser deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# 3. 装软件
apt install -y nginx git rsync ufw certbot python3-certbot-nginx

# 4. 防火墙
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

**关掉密码登录**（确认密钥能登录后再改）：

```bash
sed -i 's/^#*PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#*PermitRootLogin .*/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl reload sshd
```

## 2. 本地构建

VitePress 构建输出在 `docs/.vitepress/dist`：

```bash
npm install        # 首次安装依赖
npm run build      # 构建到 docs/.vitepress/dist
```

## 3. 放置站点

```bash
# 站点根目录
mkdir -p /var/www/linux-atlas

# 本地执行，把构建产物传上去
rsync -az --delete docs/.vitepress/dist/ deploy@你的IP:/var/www/linux-atlas/
```

## 4. 配置 Nginx

创建 `/etc/nginx/sites-available/linux-atlas`：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name 你的域名 www.你的域名;

    root /var/www/linux-atlas;
    index index.html;

    # 静态资源缓存
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /404.html;
    }

    # gzip 压缩
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

启用站点：

```bash
ln -s /etc/nginx/sites-available/linux-atlas /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

## 5. 签发 HTTPS 证书

```bash
certbot --nginx -d 你的域名 -d www.你的域名
```

确认自动续期定时器在跑（**答辩时一定要能演示**）：

```bash
systemctl list-timers | grep certbot
certbot renew --dry-run
```

## 6. 自动部署：git push 即上线

在服务器建裸仓库：

```bash
sudo mkdir -p /srv/linux-atlas.git
cd /srv/linux-atlas.git
sudo git init --bare
sudo chown -R deploy:deploy /srv/linux-atlas.git
```

写钩子 `/srv/linux-atlas.git/hooks/post-receive`：

```bash
#!/bin/bash
# git push 即上线：检出 → 构建 → 同步 → 重载 nginx
GIT_DIR=/srv/linux-atlas.git
WORK_TREE=/tmp/linux-atlas-build
SITE_DIR=/var/www/linux-atlas

git --work-tree=$WORK_TREE --git-dir=$GIT_DIR checkout -f main
cd $WORK_TREE
npm install --production=false --silent
npm run build
rsync -az --delete $WORK_TREE/docs/.vitepress/dist/ $SITE_DIR/
chown -R www-data:www-data $SITE_DIR
systemctl reload nginx
```

```bash
chmod +x /srv/linux-atlas.git/hooks/post-receive
```

本地添加远端并推送：

```bash
git remote add prod deploy@你的IP:/srv/linux-atlas.git
git push prod main
```

> 钩子要在服务器上装 Node。用 `curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt install -y nodejs`。

## 7. 加固与验收

```bash
# 隐藏 Nginx 版本号
sed -i 's/^#\?\s*server_tokens.*/server_tokens off;/' /etc/nginx/nginx.conf
```

验收清单：

- [ ] `https://你的域名` 能打开，地址栏是小锁
- [ ] `http://` 自动跳转 `https://`
- [ ] 404 页正常
- [ ] 手机浏览器布局正常
- [ ] Lighthouse 四项 90 分以上
- [ ] `curl -I https://你的域名` 看到 gzip/br
- [ ] 证书到期前会自动续期

## 8. 常见坑

| 现象 | 原因与解决 |
| --- | --- |
| certbot 报 "Timeout during connect" | 80 端口被云厂商安全组挡了，控制台也要放行 80/443 |
| 页面 403 | 目录属主不对，`chown -R www-data:www-data` |
| 改了配置没生效 | 忘了 `nginx -t && systemctl reload nginx` |
| 子路径 404 | `try_files` 写错 |
| 境外机访问慢 | 换机房或加 Cloudflare CDN |

## 附：答辩时值得展示的截图

1. `systemctl status nginx` —— 服务在跑
2. `nginx -t` —— 配置检查通过
3. `systemctl list-timers | grep certbot` —— 证书自动续期
4. `git push prod main` 输出 —— 自动化部署链路
5. Lighthouse 四项分数
6. SSL Labs 评级（A 以上）
