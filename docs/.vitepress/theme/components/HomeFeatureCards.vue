<script setup lang="ts">
import FeatureCardGrid from './FeatureCardGrid.vue'
import type { FeatureCardItem } from './FeatureCardGrid.vue'

/** 依据产品文档「核心优势」整理；增删卡片即可；mobileCols 可设为 2 / 3 / 4 */
const cards: FeatureCardItem[] = [
  {
    icon: 'zap',
    title: '极致性能，亚毫秒级',
    description:
      'Lua + Redis 防护引擎，单个请求跑完全部流程通常不到 1 毫秒。挡得住攻击，也不拖慢真实用户。'
  },
  {
    icon: 'ai',
    title: 'AI 驱动自行防护',
    description:
      '可调用 AI 生成精准策略；也支持条件触发后自动分析日志并创建规则，尽量做到无人值守持续防守。'
  },
  {
    icon: 'rules',
    title: '规则策略超级丰富',
    description:
      '30+ 匹配项覆盖 URL、IP、请求头、地域、Cookie、Bot 等；支持包含、排除、等于、正则等多种条件。'
  },
  {
    icon: 'logs',
    title: '日志筛选找攻击共性',
    description:
      '多维度排行与分析，帮你从日志里快速锁定这批请求的特征——这是打磨防护策略最关键的一步。'
  },
  {
    icon: 'shield',
    title: '功能完善，一站搞定',
    description:
      '黑白名单、例外、限速、自定义规则，再加上总览、站点、证书、Bot 库与 IP 组，日常防护集中在一块面板。'
  },
  {
    icon: 'deploy',
    title: '一键部署，上手快',
    description:
      '一条命令完成安装部署，兼容所有系统及宝塔；文档、FAQ 与实操案例帮你把站点尽快接入防护链路。'
  }
]
</script>

<template>
  <FeatureCardGrid
    title="核心能力"
    description="识别 → 拦截 → 清洗 → 守护。把站长真正用得上的防护能力一次备齐。"
    :cards="cards"
    :mobile-cols="2"
  />
</template>
