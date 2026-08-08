# Docker 部署运维

最短上线请看 [快速开始](./quick-start.md) 或 [常规服务器部署](./deploy-server.md)。本文只记站长日常会用到的命令和注意点。

## 端口是什么意思

| 端口 | 用途 |
|------|------|
| `80` / `443` | 访客访问你的网站（经流盾） |
| `9000` | 管理面板（可在 `.env` 里改 `PANEL_PORT`） |

内部依赖服务默认不暴露到公网，一般不用单独开防火墙。

## 常用命令

在项目目录下执行：

```bash
docker compose ps                 # 看是否在跑
docker compose logs -f app        # 看应用日志
docker compose restart app        # 重启
docker compose up -d --build      # 重新构建并启动
docker compose down               # 停止（保留数据）
```

简单自检：

```bash
curl -fsS http://127.0.0.1:9000/health
curl -fsS http://127.0.0.1/waf-health
```

::: danger
停止时只用 `docker compose down`。加了 `-v` 可能把业务数据一起删掉。
:::

## 回源地址怎么填

流盾跑在 Docker 里时，「本机源站」不能随便填容器自己的 `127.0.0.1`。

| 环境 | 常见写法 |
|------|----------|
| Linux 服务器 | `172.17.0.1` 或宿主机真实 IP |
| macOS Docker Desktop | `host.docker.internal` |
| 宝塔 | 回源到宝塔改过的高位端口，如 `http://172.17.0.1:8080` |

更多见 [站点配置](./sites.md)、[宝塔部署](./baota.md)。

## 出问题时先看这些

**起不来 / 提示密钥不安全**  
检查 `.env` 是否还是示例密码，改掉后再启动。

**提示 80/443 已被占用**  
停掉占用的软件，或改 `.env` 里的网站端口；用宝塔时看 [宝塔部署](./baota.md)。

**面板能开，网站 502**  
多半是回源地址或端口填错，见 [站点与证书 FAQ](./faq-sites.md)。

**内存不够 / 磁盘满**  
先 `docker compose ps` 看哪个服务不健康，再看对应日志。

## 下一步

- [升级与备份](./upgrade-backup.md)
- [接入第一个站点](./first-site.md)
