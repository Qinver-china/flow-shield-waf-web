# 快速开始

用最短步骤把流盾装上并登录面板。推荐使用一键安装脚本；需要逐步操作时再看各环境的手动安装说明。

## 你需要准备

- Linux 服务器，推荐Ubuntu/Debian/OpenCloud/Alibaba等最新版系统
- 建议内存 ≥ 2 GB
- 放行端口：`80`、`443`（网站），`9000`（管理面板，可改）
- 提前安装Docker及Docker Compose（可选，也可以不装，脚本会自动安装）

::: tip 先关掉同类防火墙应用
若服务器上已安装**宝塔 Nginx 防火墙**、**雷池**等与 WAF / 反向代理强耦合的防火墙应用，请先**关闭或卸载**，再安装流盾。它们常会按「连接来源 IP」限连或改写 Nginx，与流盾回源叠加后容易出现 502、连接被掐、偶发无法访问等冲突。
:::

## 一键安装（推荐）

首次安装先创建一个部署的文件夹，例如`/www/wwwroot/flow-shield-waf`：

```bash
mkdir -p /www/wwwroot/flow-shield-waf   # 创建文件夹，路径可自定，仅首次使用
cd /www/wwwroot/flow-shield-waf         # 进入此目录     
```

然后执行：

推荐链接：

```bash
curl -fsSL https://fswaf.top/install.sh | bash
```

备用链接（GitHub）：

```bash
curl -fsSL https://raw.githubusercontent.com/Qinver-china/flow-shield-waf/main/install.sh | bash
```

脚本会自动：

1. 检测操作系统与 Docker / Compose / Git（缺失时可自动安装；macOS 需自行安装并启动 Docker Desktop）
2. 判断是**首次安装**还是**更新**（已有 `flowshield-waf-app` 容器或项目目录）
3. 检查 `80` / `443`；若被 Nginx / 宝塔占用，可自动改 listen 端口（默认改到 `8080` / `4343`，可自定义）
4. 在当前目录克隆代码并**本地构建**（不提供预构建镜像）
5. 自动生成 `.env`（服务密钥随机；默认管理员 `admin` / `admin888`）

安装完成后打开面板地址，务必先修改管理员账号密码，然后 [接入第一个站点](./first-site.md)。

### 一键更新

使用与安装相同命令即可。在已部署机器上再次执行时，脚本会进入更新流程：备份 `.env` → `git pull` → 补齐新增环境变量 → 本地重建。

```bash
cd /www/wwwroot/flow-shield-waf         # 进入项目目录   
curl -fsSL https://fswaf.top/install.sh | bash   #执行与安装相同的命令即可
```

## 手动安装

若无法使用一键脚本，或希望逐步可控：

| 环境 | 文档 |
|------|------|
| 普通 Linux VPS | [常规服务器部署（手动）](./deploy-server.md) |
| 宝塔 | [宝塔部署（手动）](./baota.md) |

## 上线前检查一下

- 密码和密钥已由脚本生成或你已手动改过
- 防火墙已放行 80/443/9000端口
- 管理面板端口尽量别裸奔公网（可用内网或反代）
- 若改过本机 Nginx 端口，面板回源请填新端口

## 常用命令

在项目目录下：

```bash
docker compose logs -f app   # 看日志
docker compose restart app   # 重启
docker compose down          # 停止（别加 -v，否则可能删数据）
```

以后升级也可继续用一键命令，或看 [升级与备份](./upgrade-backup.md)。
