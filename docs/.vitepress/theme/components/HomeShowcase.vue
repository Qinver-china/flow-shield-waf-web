<script setup lang="ts">
import SectionHeading from './SectionHeading.vue'
import ImageCarousel from './ImageCarousel.vue'
import type { CarouselSlide } from './ImageCarousel.vue'

/** 替换 / 增删即可调整轮播图 */
const slides: CarouselSlide[] = [
  { src: '/images/slide-1.jpg', alt: '总览面板' },
  { src: '/images/slide-2.jpg', alt: '自定义规则' },
  { src: '/images/slide-3.jpg', alt: '创建速率规则' },
  { src: '/images/slide-4.jpg', alt: 'AI 防护' },
  { src: '/images/slide-5.jpg', alt: 'BOT管理' },
  { src: '/images/slide-6.jpg', alt: '日志统计' },
]
</script>

<template>
  <section class="fs-home-showcase" aria-label="功能界面展示">
    <div class="fs-home-showcase__inner">
      <SectionHeading
        title="功能界面一览"
        description="从总览态势到站点、规则、日志与 AI 防护，覆盖日常运维的核心工作台。"
      />
      <div class="fs-home-showcase__media">
        <ImageCarousel :slides="slides" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.fs-home-showcase {
  padding: 28px 24px 64px;
}

.fs-home-showcase__inner {
  max-width: 1152px;
  margin: 0 auto;
}

.fs-home-showcase__media {
  margin-top: 40px;
}

@media (min-width: 640px) {
  .fs-home-showcase {
    padding: 36px 48px 80px;
  }

  .fs-home-showcase__media {
    margin-top: 48px;
  }
}

@media (min-width: 960px) {
  .fs-home-showcase {
    padding: 40px 64px 96px;
  }
}
</style>
