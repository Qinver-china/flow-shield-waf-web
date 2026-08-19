# 升级与备份

已经用 Docker 装好流盾后，按下面做升级和备份。升级不会故意清空你的站点配置；生产环境升级前建议先备份。

## 一键更新（推荐）

1.先进入项目文件夹，例如你的项目路径为`/www/wwwroot/flow-shield-waf`

```bash
cd /www/wwwroot/flow-shield-waf         # 进入此目录     
```

2.然后执行安装脚本即可（脚本会自动识别已安装环境）：

推荐链接：

```bash
curl -fsSL https://fswaf.top/install.sh | bash
```

备用链接：

```bash
curl -fsSL https://raw.githubusercontent.com/Qinver-china/flow-shield-waf/main/install.sh | bash
```

脚本会：备份 `.env` → 拉取代码 → 补齐新增环境变量 → 本地重建并做健康检查。构建成功后会清理未使用的 Docker 构建缓存与悬空镜像，减轻多次升级后的磁盘占用。健康检查通过后会再检测本机宝塔 / 1Panel；若已有同服务器账号则跳过，不会覆盖你改过的配置。

## 升级会影响什么

- 升级时网站可能短暂抖十几到几十秒（应用在重建）
- 若你改了 `.env` 里的登录相关密钥，已登录的人可能要重新登录 —— **平时别乱改这两个密钥**
- 站点、规则、证书等配置不会有任何影响
- `.env` 会保留（含 `EXTRA_LISTEN_PORTS` 等）；一键更新启动前会按 `.env` 重新生成 `docker-compose.override.yml`。不要手改该文件，改端口只动 `.env`
- 其他变动请自行查看[更新日志](../changelog.md)

## 怎么备份

在服务器项目目录执行：

```bash
cd /path/to/flow-shield-waf

# 备份环境变量
cp .env .env.bak.$(date +%Y%m%d)

# 备份面板配置库
docker compose exec -T app cp /data/waf.db /tmp/waf_backup_$(date +%Y%m%d).db
docker cp flowshield-waf-app:/tmp/waf_backup_$(date +%Y%m%d).db ./
```

也可以在面板里：**系统设置 → 导出/导入**，把站点、证书、规则等配置导出成文件，方便迁移或灾备（不含很久以前的历史日志明细）。

::: tip
导入前建议先再导出一份当前配置，出问题好回退。导入「系统设置」分段后会重载引擎，使请求体上限、源站超时等立刻生效。细节见 [系统设置](./settings.md#backup)。
:::

## 手动升级步骤

### 1. 先备份

按上一节做 `.env` 和配置库备份。

### 2. 拉新代码

```bash
git pull origin main
```

若用压缩包覆盖，**务必保留原来的 `.env`**。

### 3. 核对有没有新配置项

```bash
diff .env.example .env || true
```

新版本若多了变量，补进你的 `.env`。不要随便改 `JWT_SECRET`、`WAF_CHALLENGE_SECRET`。

### 4. 重新构建启动

```bash
docker compose up -d --build
```

构建成功后建议清理缓存（不影响运行中的服务与数据）：

```bash
docker builder prune -f
docker image prune -f
```

一键更新会自动做这两步。

### 5. 验证

```bash
docker compose ps
curl -fsS http://127.0.0.1:9000/health
curl -fsS http://127.0.0.1/waf-health
```

再登录面板，随便打开一个站点确认能访问。

## 出问题怎么回退

```bash
git checkout <之前的版本或提交>
docker compose up -d --build app
```

严重时用备份的 `waf.db` / 导出文件恢复。

## 升级后检查清单

- 服务都在跑
- 面板能登录
- 至少一个站点能正常打开源站内容
- 有流量时日志里能看到记录
- `.env` 密钥没被误改

各版本具体改了什么，见 [更新日志](/changelog)。
