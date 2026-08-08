# 快速开始

用最短步骤把流盾装上并登录面板。更细的 VPS 说明见 [常规服务器部署](./deploy-server.md)；宝塔见 [宝塔部署](./baota.md)。

## 你需要准备

- 一台装好 Docker 的 Linux 服务器（建议内存 ≥ 2 GB）
- 放行端口：`80`、`443`（网站），`9000`（管理面板，可改）

## 1. 下载并改配置

```bash
git clone https://github.com/Qinver-china/flow-shield-waf.git
cd flow-shield-waf

cp .env.example .env
```

打开 `.env`，至少改掉这些：

| 要改的项 | 干什么用 |
|----------|----------|
| `REDIS_PASSWORD` | 内部密码（随便改成复杂一点的） |
| `JWT_SECRET` | 登录安全密钥（一长串随机字符） |
| `WAF_CHALLENGE_SECRET` | 人机验证用的密钥（同样改成随机串） |
| `WAF_ADMIN_USER` / `WAF_ADMIN_PASSWORD` | 面板登录账号和密码 |

::: tip
如果还用示例里的默认密钥，服务可能拒绝启动。务必改成自己的。
:::

## 2. 检查端口

流盾对外提供网站访问时，需要占用服务器的 **80**（HTTP）和 **443**（HTTPS）端口。启动前先确认这两个端口空闲，否则容器起不来或无法对外服务。

在服务器上执行下面任一命令，看谁占用了端口：

```bash
# 推荐：ss
ss -tlnp | grep -E ':80 |:443 '

# 或
lsof -iTCP:80 -sTCP:LISTEN
lsof -iTCP:443 -sTCP:LISTEN

# 或（部分系统需先安装 net-tools）
netstat -tlnp | grep -E ':80 |:443 '
```

如果命令没有输出，一般表示端口空闲，可以进入下一步。

如果端口已被占用，按下面列表排查处理：

### (a) 方案 1：本机已安装 Nginx

若服务器上已经装了 Nginx，并由它托管多个网站，通常会占用 80 / 443。需要把 **Nginx 下所有网站** 的监听端口都改成其他端口（例如 `8080` / `8443`），把 80 / 443 留给流盾。

常见改法：

1. 找到 Nginx 站点配置（常见路径如 `/etc/nginx/sites-enabled/`、`/etc/nginx/conf.d/`）
2. 把各站点里的 `listen 80;`、`listen 443 ssl;` 等改成新端口
3. 检查配置并重载：

```bash
nginx -t && systemctl reload nginx
```

改完后，流盾面板里配置站点回源时，源站端口要填 Nginx 的新端口，而不是 80 / 443。

::: tip
用宝塔面板时，端口协调方式见 [宝塔部署](./baota.md)。
:::

## 3. 启动

```bash
docker compose up -d --build
docker compose ps
```

第一次会构建一会儿。看到服务都在跑就可以了。

## 4. 登录

1. 浏览器打开 `http://<服务器IP>:9000`
2. 用 `.env` 里的管理员账号登录

![登录页面](/images/login.png)

3. 接着做：[接入第一个站点](./first-site.md)

## 上线前检查一下

- 密码和密钥都改过了
- 防火墙已放行 80/443
- 管理面板端口尽量别裸奔公网（可用内网或反代）

## 常用命令

```bash
docker compose logs -f app   # 看日志
docker compose restart app   # 重启
docker compose down          # 停止（别加 -v，否则可能删数据）
```

宝塔占用了 80/443？看 [宝塔部署](./baota.md)。以后升级看 [升级与备份](./upgrade-backup.md)。
