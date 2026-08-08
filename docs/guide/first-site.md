# 接入第一个站点

部署并登录面板后，按这个顺序接入第一个网站。字段细节见 [站点配置](./sites.md)、[证书管理](./certificates.md)。

## 推荐顺序

1. （要 HTTPS）先上传证书  
2. 新增站点，填好回源  
3. 有 CDN 时，选对「客户端 IP 获取方式」  
4. 把域名 DNS 指到本机  

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
| CF-Connecting-IP | Cloudflare |
| True-Client-IP | Akamai 等 |
| X-Real-IP / X-Client-IP | 一般反代 |
| X-Forwarded-For（第一个/最后一个） | 多层代理 |

## 5. 改 DNS

把域名的 A / AAAA 指到本机公网 IP（或把 CDN 回源指到本机）。生效后到 [总览](./dashboard.md) 或 [防护日志](./logs.md) 看有没有请求进来。

## 6. 接入完成检查

- 面板能登录
- 网站 HTTP/HTTPS 能打开
- 日志里能看到这个站的访问
- 走 CDN 时，日志里的 IP 是访客真实 IP，不是边缘节点

## 下一步

按 [渐进上线防护](./practice-gradual-rollout.md) 先开观察，再看 [防护策略总览](./protection-basics.md)。
