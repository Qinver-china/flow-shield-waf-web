# 宝塔部署（手动）

流盾可以和宝塔装在同一台机器上。部署方式和普通服务器一样用 Docker，关键是把 **80 / 443 端口协调好**。

更省事请优先用 [快速开始](./quick-start.md) 的一键安装（脚本可自动处理 Nginx 端口）。本文为手动步骤。

## 开始前

1. 宝塔软件商店里装好 **Docker 管理器**
2. 放行 `80`、`443`（网站）和 `9000`（面板，可改）

::: tip 先关掉同类防火墙应用
若已安装**宝塔 Nginx 防火墙**、**雷池**等与 WAF / 反向代理强耦合的防火墙应用，请先**关闭或卸载**，再部署流盾。它们常按连接来源 IP 限连或改写 Nginx；流盾回源时源站往往只看到 Docker 网关 IP，容易整站被误限，出现 502、连接被掐等冲突。
:::

## 1. 下载并改配置

```bash
# 在宝塔左侧菜单栏打开终端，依次输入以下命令：
cd /www/wwwroot
git clone https://github.com/Qinver-china/flow-shield-waf.git
cd flow-shield-waf

cp .env.example .env #仅首次安装拷贝
vi .env   # 推荐修改密码、密钥
```

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

### (a) 方案 1：本机已安装 Nginx（含宝塔 Nginx）

宝塔默认会用 Nginx 托管网站，通常已占用 80 / 443。需要把 **Nginx / 宝塔下所有网站** 的监听端口都改成其他端口（例如 `8080` / `4343`），把 80 / 443 留给流盾。

常见改法（宝塔面板）：

1. 打开宝塔 → **网站**，逐个站点进入设置
2. 把 HTTP / HTTPS 监听端口改为高位端口（如 `8080` / `4343`）
3. 保存后确认 Nginx 已重载

或在服务器上直接改 Nginx 配置（常见路径如 `/www/server/panel/vhost/nginx/`），把各站点里的 `listen 80;`、`listen 443 ssl;` 等改成新端口，然后重启 nginx 服务：

![宝塔修改nginx端口](/images/baota-port-edit.png)

```bash
# 重启nginx服务的命令
nginx -t && nginx -s reload
```

改完后，记住刚刚改的 HTTP 和 HTTPS 端口分别是多少，最后我们部署完成之后，在流盾 WAF 后台添加站点的时候，就填写改之后的端口。

## 3. 构建并启动

```bash
docker compose up -d --build
```

## 4. 登录并添加网站

- 面板地址：`http://<服务器IP>:9000`
- 全新安装首次打开登录页时设置管理员账号密码；已有环境使用已设置的账号登录

接着按 [接入第一个站点](./first-site.md) 添加网站。一键安装若检测到本机宝塔，会在「系统设置 → 面板集成」写入「本机宝塔」账号，可按 [从其他面板导入](./panel-import.md) 批量接入；手动添加时，回源端口填写刚刚改过的高位端口。

![宝塔修改添加站点](/images/baota-add-site.jpg)

## 升级

推荐再次执行一键命令（见 [快速开始](./quick-start.md)），或：

```bash
cd /www/wwwroot/flow-shield-waf   # 按你的实际路径
bash install.sh
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
