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

## 拉取 redis/clickhouse 报错

通常是本机 Docker 的 **registry-mirrors** 仍指向已下线的加速源（最常见：`docker.mirrors.ustc.edu.cn`）。2024 年中起中科大等公开 Docker Hub 缓存已停服，DNS 会解析失败。

立刻修复：

```bash
# 查看当前加速源
docker info | grep -A10 'Registry Mirrors'

# 编辑配置，删掉失效地址（可整段去掉 registry-mirrors）
sudo vi /etc/docker/daemon.json
sudo systemctl restart docker

# 再启动
docker compose up -d --build
```

一键安装脚本在启动前会检测已知失效源，并提示是否自动清理。

## 升级会丢数据吗？

常规升级重建容器**不会**删数据卷。只有带清卷的卸载，或官方「全新开始」脚本才会清空。详见 [升级与备份](./upgrade-backup.md)。

## 数据在哪？怎么备份？

配置库在应用数据卷里（容器内常见路径 `/data/waf.db`）。备份命令见升级文档。

## 宝塔和流盾怎么共存？

流盾对外 80/443，宝塔网站听高位端口，站点回源到该端口。见 [宝塔部署](./baota.md)、[CDN / 宝塔共存](./practice-cdn-baota.md)。
