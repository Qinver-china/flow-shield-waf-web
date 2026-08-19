# 常规服务器部署（手动）

本文是**手动安装步骤**。更省事请用 [快速开始](./quick-start.md) 里的一键安装命令。若你用宝塔，也可直接看 [宝塔部署（手动）](./baota.md)。

## 环境要求

| 项 | 要求 |
|----|------|
| 系统 | Ubuntu / Debian / CentOS 等常见 Linux；或 macOS + Docker Desktop |
| Docker | 已安装，可用 `docker compose` |
| 内存 | 建议 ≥ 2 GB |
| 端口 | `80`、`443`（网站），`9000`（面板，可改） |

先确认服务器上没有别的软件长期占着 80/443；若有，要么停掉，要么改端口（宝塔场景见对应文档）。

::: tip 先关掉同类防火墙应用
若已安装**宝塔 Nginx 防火墙**、**雷池**等与 WAF / 反向代理强耦合的防火墙应用，请先**关闭或卸载**再部署流盾，否则可能与回源叠加冲突（502、连接被掐等）。
:::

## 1. 安装 Docker（没有的话）

按 [Docker 官方安装说明](https://docs.docker.com/engine/install/) 装好后检查：

```bash
docker --version
docker compose version
```

macOS 请安装并启动 [Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/)。

## 2. 下载代码

```bash
git clone https://github.com/Qinver-china/flow-shield-waf.git
cd flow-shield-waf
```

## 3. 改环境变量(仅首次安装)

```bash
cp .env.example .env
vi .env
```

**推荐修改：**

| 变量 | 说明 |
|------|------|
| `REDIS_PASSWORD` | 内部服务密码 |
| `JWT_SECRET` | 登录相关密钥（建议长随机串） |
| `WAF_CHALLENGE_SECRET` | 验证相关密钥（建议长随机串） |

可选：

| 变量 | 默认 | 说明 |
|------|------|------|
| `PANEL_PORT` | `9000` | 面板端口 |
| `WAF_HTTP_PORT` / `WAF_HTTPS_PORT` | `80` / `443` | 网站默认对外端口 |
| `EXTRA_LISTEN_PORTS` | 空 | 站点自定义监听端口，逗号分隔，如 `9088`。改完后执行 `bash scripts/sync-compose-ports.sh && docker compose up -d`。不要手改 `docker-compose.override.yml`。只写在 `.env`，升级不会冲掉。示例见 [站点配置](./sites.md#custom-listen-ports) |
| `WAF_ORIGIN_HOST_GATEWAY` | Linux `172.17.0.1`；macOS 建议 `host.docker.internal` | 回源到本机源站时的网关 |

::: tip
`.env.example` 已预置可用长度的密钥，直接复制也能启动；生产环境请尽快改成你自己的随机值。一键安装脚本会自动随机生成这些值。
:::

## 4. 检查端口

```bash
ss -tlnp | grep -E ':80 |:443 '
```

若被本机 Nginx 占用，把各站点 `listen 80/443` 改到高位端口（如 `8080` / `4343`）后重载 Nginx。

## 5. 放行防火墙 / 安全组

- `80`、`443`：给访客访问网站
- `9000`（或你改过的面板端口）：尽量只给自己用（内网 / VPN / 反代）

## 6. 启动

```bash
docker compose up -d --build
docker compose ps
```

第一次构建可能要几分钟，服务都起来后再登录。

## 7. 登录并接入站点

1. 打开 `http://<服务器公网IP>:9000`
2. 全新安装首次打开登录页时设置管理员账号密码
3. 按 [接入第一个站点](./first-site.md) 配证书、站点和 DNS

## 升级、备份、停止

- 升级与备份：[升级与备份](./upgrade-backup.md)
- 停止服务（保留数据）：`docker compose down`
- 删除服务并清空数据（不可恢复）：`docker compose down -v` —— 生产慎用

端口冲突、起不来等问题，见 [部署与运维 FAQ](./faq-deploy.md)。

## 清理多余的构建缓存

由于 Docker 的机制，每次构建应用都会在本地留下历史构建缓存与悬空镜像，多次升级构建后可能会占用较大的磁盘空间。手动构建**成功**后可执行以下清理（不影响任何数据与服务）：

```bash
docker builder prune -f
docker image prune -f
```

查看占用：

```bash
docker system df
```

::: tip
一键安装 / 更新脚本会在构建成功后自动执行上述清理。
:::
