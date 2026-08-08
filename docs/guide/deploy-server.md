# 常规服务器部署

在普通 Linux VPS / 云服务器上，用 Docker 安装流盾。若你用宝塔，请改看 [宝塔部署](./baota.md)。

## 环境要求

| 项 | 要求 |
|----|------|
| 系统 | Ubuntu / Debian / CentOS 等常见 Linux |
| Docker | 已安装，可用 `docker compose` |
| 内存 | 建议 ≥ 2 GB |
| 端口 | `80`、`443`（网站），`9000`（面板，可改） |

先确认服务器上没有别的软件长期占着 80/443；若有，要么停掉，要么改端口（宝塔场景见对应文档）。

## 1. 安装 Docker（没有的话）

按 [Docker 官方安装说明](https://docs.docker.com/engine/install/) 装好后检查：

```bash
docker --version
docker compose version
```

## 2. 下载代码

```bash
git clone https://github.com/Qinver-china/flow-shield-waf.git
cd flow-shield-waf
```

## 3. 改环境变量

```bash
cp .env.example .env
vi .env
```

**必须改：**

| 变量 | 说明 |
|------|------|
| `REDIS_PASSWORD` | 内部服务密码 |
| `JWT_SECRET` | 登录相关密钥（≥ 16 位随机串） |
| `WAF_CHALLENGE_SECRET` | 验证相关密钥（≥ 16 位随机串） |
| `WAF_ADMIN_USER` / `WAF_ADMIN_PASSWORD` | 面板账号密码 |

可选：

| 变量 | 默认 | 说明 |
|------|------|------|
| `PANEL_PORT` | `9000` | 面板端口 |
| `WAF_HTTP_PORT` / `WAF_HTTPS_PORT` | `80` / `443` | 网站对外端口 |

::: tip
密钥还是示例值时，服务可能起不来。务必改成自己的。
:::

## 4. 放行防火墙 / 安全组

- `80`、`443`：给访客访问网站
- `9000`（或你改过的面板端口）：尽量只给自己用（内网 / VPN / 反代）

## 5. 启动

```bash
docker compose up -d --build
docker compose ps
```

第一次构建可能要几分钟，服务都起来后再登录。

## 6. 登录并接入站点

1. 打开 `http://<服务器公网IP>:9000`
2. 用 `.env` 里的账号登录
3. 按 [接入第一个站点](./first-site.md) 配证书、站点和 DNS

把域名的 A / AAAA 记录指到这台服务器公网 IP，解析生效后流量就会先过流盾再回源站。

## 升级、备份、停止

- 升级与备份：[升级与备份](./upgrade-backup.md)
- 停止服务（保留数据）：`docker compose down`
- 删除服务并清空数据（不可恢复）：`docker compose down -v` —— 生产慎用

端口冲突、起不来等问题，见 [部署与运维 FAQ](./faq-deploy.md)。
