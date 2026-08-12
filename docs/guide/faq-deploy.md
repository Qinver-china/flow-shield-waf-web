# 部署与运维 FAQ

相关教程：[快速开始](./quick-start.md) · [常规服务器部署（手动）](./deploy-server.md) · [宝塔部署（手动）](./baota.md)

## 80/443 被占用，起不来

先查谁占用了端口。宝塔场景：把网站改到高位端口，让流盾占 80/443（推荐）。或改部署配置里的 HTTP/HTTPS 端口，并同步改防火墙与 DNS。

## 容器一直不健康 / 数据库起不来

常见原因：内存不够、磁盘满、首次初始化慢、密码不一致。

磁盘被防护日志撑满时，可缩短保留天数或降低观察采样率，见 [性能优化指南](./practice-performance.md)。

看状态与日志：

```bash
docker compose ps
docker compose logs --tail=100 clickhouse
docker compose logs --tail=100 app
```

建议内存 ≥ 2GB；各处密码保持一致。

## 构建时报网络 temporary error

容器出网差。可在 compose 里给构建开 `network: host` 后重建，或本机构建镜像再拷到服务器。

## 拉取镜像失败（timeout / dial tcp / i/o timeout）

安装或 `docker compose up -d --build` 时，若卡在拉取 `node`、`openresty`、`redis`、`clickhouse` 等基础镜像，日志类似：

- `failed to resolve source metadata for docker.io/...`
- `dial tcp ...:443: i/o timeout`
- `Head "https://registry-1.docker.io/...": ...`

说明本机访问 Docker Hub（`registry-1.docker.io`）不通或极慢，国内服务器建议配置镜像加速后再装。

国内推荐1： [轩辕镜像](https://xuanyuan.cloud/) 一键配置：

```bash
bash <(wget -qO- https://xuanyuan.cloud/docker.sh)
```

国内推荐2： [毫秒镜像](https://1ms.run/guide) 一键配置：

```bash
bash <(curl -sSL https://n3.ink/helper)
```

按提示完成 Docker 加速配置后，回到安装目录重新执行一键安装，或：

```bash
docker compose up -d --build
```

也可手动写入加速源：

```bash
echo '{"registry-mirrors":["https://docker.xuanyuan.me","https://docker.1ms.run"],"dns": ["8.8.8.8", "114.114.114.114"]}' | sudo tee /etc/docker/daemon.json > /dev/null
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 升级会丢数据吗？

常规升级重建容器**不会**删数据卷。只有带清卷的卸载，或官方「全新开始」脚本才会清空。详见 [升级与备份](./upgrade-backup.md)。

## 数据在哪？怎么备份？

配置库在应用数据卷里（容器内常见路径 `/data/waf.db`）。备份命令见升级文档。

## 宝塔和流盾怎么共存？

流盾对外 80/443，宝塔网站听高位端口，站点回源到该端口。见 [宝塔部署](./baota.md)、[CDN / 宝塔共存](./practice-cdn-baota.md)。
