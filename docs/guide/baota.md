# 宝塔部署

流盾可以和宝塔装在同一台机器上。部署方式和普通服务器一样用 Docker，关键是把 **80 / 443 端口协调好**。

## 开始前

1. 宝塔软件商店里装好 **Docker 管理器**
2. 放行 `80`、`443`（网站）和 `9000`（面板，可改）

## 端口怎么协调（最重要）

流盾对外需要听 `80` / `443`。如果宝塔 Nginx 已经占用了这两个端口，二选一：

- **推荐**：把宝塔网站改成听高位端口（如 `8080` / `8443`），对外只让流盾接访客；流盾回源到宝塔那个高位端口
- **只保护部分站**：被保护的站在流盾里回源到宝塔对应的高位端口

在流盾面板 **站点管理** 里填源站时，常用：

- 地址：`host.docker.internal` 或 `172.17.0.1`
- HTTP 端口：宝塔实际监听的端口，例如 `8088`

更完整的共存思路见 [CDN / 宝塔共存](./practice-cdn-baota.md)。

## 首次安装

```bash
cd /www/wwwroot
git clone https://github.com/Qinver-china/flow-shield-waf.git
cd flow-shield-waf

cp .env.example .env
vi .env   # 改密码、密钥、管理员账号
```

然后任选其一：

```bash
bash deploy/baota/install.sh
```

或：

```bash
docker compose up -d --build
```

## 登录

- 面板地址：`http://<服务器IP>:9000`
- 账号密码：`.env` 里的 `WAF_ADMIN_USER` / `WAF_ADMIN_PASSWORD`
- 站点配好后，把域名解析到本机

接着按 [接入第一个站点](./first-site.md) 做证书和回源。

## 升级

```bash
cd /www/wwwroot/flow-shield-waf   # 按你的实际路径
bash deploy/baota/upgrade.sh
```

或手动：

```bash
cp .env .env.bak.$(date +%Y%m%d)
git pull origin main
docker compose up -d --build
```

完整说明见 [升级与备份](./upgrade-backup.md)。

::: warning
升级时应用会短暂重建，网站可能抖十几到几十秒。不要随便改 `.env` 里的登录相关密钥，否则大家可能要重新登录。
:::

## 日常运维

```bash
docker compose ps
docker compose logs -f app
docker compose restart app
docker compose down               # 停止，勿加 -v
```

简单备份配置库：

```bash
docker compose exec -T app cp /data/waf.db /tmp/waf_backup_$(date +%Y%m%d).db
docker cp flowshield-waf-app:/tmp/waf_backup_$(date +%Y%m%d).db ./
```

构建失败、端口冲突等，见 [部署与运维 FAQ](./faq-deploy.md)。
