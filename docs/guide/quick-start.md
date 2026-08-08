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

## 2. 启动

```bash
docker compose up -d --build
docker compose ps
```

第一次会构建一会儿。看到服务都在跑就可以了。

## 3. 登录

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
