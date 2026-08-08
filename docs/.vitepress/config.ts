import { defineConfig } from 'vitepress'

const siteName = '流盾 WAF - Flow Shield WAF'
const siteDescription =
  '流盾 WAF - Flow Shield WAF，守住每一次真实访问。面向网站与 Web 应用的智能流量防护系统，基于 OpenResty 反向代理，支持 CC 防护、规则引擎与 Docker 一键部署。'
const homeOgTitle = '流盾 WAF - Flow Shield WAF - 守住每一次真实访问'

export default defineConfig({
  lang: 'zh-CN',
  title: siteName,
  description: siteDescription,
  titleTemplate: `:title - ${siteName}`,
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/brand/icon.png' }],
    ['meta', { name: 'theme-color', content: '#3474ff' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          '流盾 WAF,Flow Shield WAF,WAF,Web应用防火墙,CC防护,OpenResty,反向代理,流量防护,Docker'
      }
    ],
    ['meta', { name: 'author', content: '老唐' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:site_name', content: siteName }],
    ['meta', { property: 'og:title', content: homeOgTitle }],
    ['meta', { property: 'og:description', content: siteDescription }],
    ['meta', { property: 'og:image', content: '/brand/logo-square-light.png' }],
    ['meta', { property: 'og:image:alt', content: siteName }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: homeOgTitle }],
    ['meta', { name: 'twitter:description', content: siteDescription }],
    ['meta', { name: 'twitter:image', content: '/brand/logo-square-light.png' }]
  ],

  transformPageData(pageData) {
    const title = pageData.title || siteName
    const description = pageData.description || siteDescription
    const isHome = pageData.relativePath === 'index.md'
    const ogTitle = isHome ? homeOgTitle : `${title} - ${siteName}`

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:title', content: ogTitle }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: ogTitle }],
      ['meta', { name: 'twitter:description', content: description }]
    )
  },

  themeConfig: {
    logo: {
      light: '/brand/logo-horizontal-light.svg',
      dark: '/brand/logo-horizontal-dark.svg',
      alt: '流盾 WAF'
    },
    siteTitle: false,
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/guide/what-is-flow-shield' },
      { text: '快速开始', link: '/guide/quick-start' },
      { text: '更新日志', link: '/changelog' }
    ],
    sidebar: {
      '/changelog': [
        {
          text: '发布说明',
          items: [
            { text: '更新日志', link: '/changelog' },
            { text: '升级与备份', link: '/guide/upgrade-backup' }
          ]
        }
      ],
      '/guide/': [
        {
          text: '简介与概览',
          items: [
            { text: '产品介绍', link: '/guide/what-is-flow-shield' },
            { text: '核心概念', link: '/guide/concepts' }
          ]
        },
        {
          text: '安装与部署',
          items: [
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '常规服务器部署', link: '/guide/deploy-server' },
            { text: 'Docker 部署详解', link: '/guide/deploy-docker' },
            { text: '宝塔部署', link: '/guide/baota' },
            { text: '升级与备份', link: '/guide/upgrade-backup' },
            { text: '更新日志', link: '/changelog' }
          ]
        },
        {
          text: '功能使用教程',
          items: [
            { text: '接入第一个站点', link: '/guide/first-site' },
            { text: '总览面板', link: '/guide/dashboard' },
            { text: '站点配置', link: '/guide/sites' },
            { text: '证书管理', link: '/guide/certificates' },
            {
              text: '防护策略',
              collapsed: false,
              items: [
                { text: '策略总览', link: '/guide/protection-basics' },
                { text: '黑名单', link: '/guide/blacklist' },
                { text: '白名单', link: '/guide/whitelist' },
                { text: '防护例外', link: '/guide/exceptions' },
                { text: '防护速率', link: '/guide/ratelimit' },
                { text: '自定义防护规则', link: '/guide/rules' }
              ]
            },
            { text: 'AI 防护', link: '/guide/ai-guard' },
            { text: 'Bot 库管理', link: '/guide/bots' },
            { text: 'IP 组管理', link: '/guide/ip-groups' },
            { text: '防护日志', link: '/guide/logs' },
            { text: '预警通知', link: '/guide/alerts' },
            { text: '系统设置', link: '/guide/settings' }
          ]
        },
        {
          text: '规则匹配条件详解',
          items: [
            { text: '条件表达式', link: '/guide/rules-basics' },
            { text: '条件字段参考', link: '/guide/conditions' }
          ]
        },
        {
          text: '常用问题解答',
          items: [
            { text: '常见问题总览', link: '/guide/faq' },
            { text: '部署与运维 FAQ', link: '/guide/faq-deploy' },
            { text: '站点与证书 FAQ', link: '/guide/faq-sites' },
            { text: '防护与规则 FAQ', link: '/guide/faq-rules' },
            { text: 'AI 与通知 FAQ', link: '/guide/faq-ai-alerts' }
          ]
        },
        {
          text: '最佳实践案例',
          items: [
            { text: '最佳实践总览', link: '/guide/best-practices' },
            { text: '渐进上线防护', link: '/guide/practice-gradual-rollout' },
            { text: '防 CC / 限速实战', link: '/guide/practice-cc' },
            { text: 'CDN / 宝塔共存', link: '/guide/practice-cdn-baota' },
            { text: '放行合法爬虫', link: '/guide/practice-allow-bots' },
            { text: '攻击应急处置', link: '/guide/practice-incident' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Qinver-china/flow-shield-waf' }
    ],
    footer: {
      message: 'Released under PolyForm Noncommercial 1.0.0',
      copyright: 'Copyright © Flow Shield WAF & zibll'
    },
    outline: {
      label: '本页目录',
      level: [2, 3]
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    lastUpdated: {
      text: '最后更新'
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    }
  }
})
