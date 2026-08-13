# 接入第一个站点

部署并登录面板后，按这个顺序接入第一个网站。字段细节见 [站点配置](./sites.md)、[证书管理](./certificates.md)。本机已有宝塔 / 1Panel 站点时，可直接 [从其他面板导入](./panel-import.md)。

## 推荐顺序

1. （要 HTTPS）先上传证书，或从宝塔 / 1Panel 导入  
2. 新增站点，填好回源；同机面板也可直接「从其他面板导入」  
3. 有 CDN 时，选对「客户端 IP 获取方式」  
4. 把域名 DNS 指到本机  

## 从宝塔 / 1Panel 导入

本机已有面板站点时，不必一条条手填。完整步骤、同机回源和测连排错见 [从其他面板导入](./panel-import.md)。

一句话：系统设置里确认「本机宝塔 / 本机 1Panel」账号并测连 → **站点管理** 右上角 **从其他面板导入** → 抽屉里选宝塔或 1Panel → 勾选后导入。这是一次性导入，不是两边持续同步。

## 1. 上传证书（HTTPS）

1. 打开 **证书管理**
2. 上传或粘贴证书和私钥
3. 可选：打开到期提醒（需先配好邮件）
4. 稍后在站点里选这张证书

![证书管理界面](/images/certificates.png)
<!-- TODO: 截图 证书管理上传页 -->

## 2. 新增站点

打开 **站点管理** → 新增站点，主要填这些：

| 填什么 | 怎么填 |
|--------|--------|
| 域名 | 你的域名，也可 `*.example.com` |
| 回源地址 | 源站机器地址，如 `172.17.0.1` 或 `host.docker.internal` |
| 回源端口 | 源站实际端口（宝塔高位端口常见如 8080） |
| 监听 HTTP / HTTPS | 至少开一个；HTTPS 必须选证书 |
| 客户端 IP 获取方式 | 无 CDN 用直连；有 CDN 选对应头 |

![新增站点表单](/images/sites-create.png)
<!-- TODO: 截图 新增站点表单 -->

## 3. 回源到本机时注意

| 环境 | 常见写法 |
|------|----------|
| Linux Docker | `172.17.0.1` 或宿主机 IP |
| macOS Docker Desktop | `host.docker.internal` |
| 宝塔共存 | `172.17.0.1` |
| 站点不在同一个服务器 | 填站点的源IP地址 |

### HTTPS 和强制 HTTPS：

如果你的源站也启用了`HTTPS`，那么源站一定要关闭`强制HTTPS`。在流盾WAF 可以开启`强制HTTPS`

::: warning
源站连不上时，访客看到的是 502/503/504 一类错误，不是规则拦截页。先检查地址和端口。
:::

## 4. 有 CDN 时：让系统认出真实 IP

| 选项 | 什么时候用 |
|------|------------|
| 直连 IP | 没有 CDN |
| X-Forwarded-For（第一个） | 大多数 CDN 都是这个 |
| CF-Connecting-IP | Cloudflare |
| True-Client-IP | Akamai 等 |
| X-Real-IP / X-Client-IP | 一般反代 |

::: tip 技巧
如果没有使用 CDN，就选 直连 IP。如果上游使用了 CDN，那么先选 X-Forwarded-For，然后再观察一下。大多数的 CDN 都是使用的 X-Forwarded-For，如果 X-Forwarded-For 获取不到正确的 IP，再选择其他的测试
:::

## 5. 改 DNS

把域名的 A / AAAA 指到本机公网 IP（或把 CDN 回源指到本机）。生效后到 [总览](./dashboard.md) 或 [防护日志](./logs.md) 看有没有请求进来。

## 6. 接入完成检查

- 面板能登录
- 网站 HTTP/HTTPS 能打开
- 日志里能看到这个站的访问
- 走 CDN 时，日志里的 IP 是访客真实 IP，不是边缘节点

## 下一步

按 [渐进上线防护](./practice-gradual-rollout.md) 先开观察，再看 [防护策略总览](./protection-basics.md)。本机面板站点也可走 [从其他面板导入](./panel-import.md)。
