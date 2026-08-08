<script setup lang="ts">
import { ref } from 'vue'
import HeroStack3D from './HeroStack3D.vue'

const heroRoot = ref<HTMLElement | null>(null)

const points = [
  {
    title: '超高性能',
    icon: 'zap'
  },
  {
    title: '规则引擎',
    icon: 'rules'
  },
  {
    title: 'AI 驱动',
    icon: 'ai'
  }
] as const
</script>

<template>
  <section ref="heroRoot" class="fs-home-hero" aria-label="流盾 WAF 简介">
    <div class="fs-home-hero__inner">
      <div class="fs-home-hero__copy">
        <h1 class="fs-home-hero__heading">
          <span class="fs-home-hero__name">流盾 WAF</span>
          <span class="fs-home-hero__text">守住每一次真实访问</span>
        </h1>

        <p class="fs-home-hero__tagline">
          面向网站、业务接口与 Web 应用的智能流量防护系统。基于 OpenResty
          反向代理，识别 → 拦截 → 清洗 → 守护。
        </p>

        <ul class="fs-home-hero__points">
          <li v-for="point in points" :key="point.title" class="fs-home-hero__point">
            <span class="fs-home-hero__point-icon" aria-hidden="true">
              <svg v-if="point.icon === 'zap'" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 2 4 13.5h6.5L11 22l9-11.5h-6.5L13 2Z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
              </svg>
              <svg v-else-if="point.icon === 'rules'" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 6h12M8 12h12M8 18h12"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
                <circle cx="4.5" cy="6" r="1.5" fill="currentColor" />
                <circle cx="4.5" cy="12" r="1.5" fill="currentColor" />
                <circle cx="4.5" cy="18" r="1.5" fill="currentColor" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none">
                <!-- AI 星芒：主星 + 辅星 -->
                <path
                  d="M12 2.5 13.35 8.2a1.2 1.2 0 0 0 .85.85L20 10.4l-5.8 1.35a1.2 1.2 0 0 0-.85.85L12 18.3l-1.35-5.7a1.2 1.2 0 0 0-.85-.85L4 10.4l5.8-1.35a1.2 1.2 0 0 0 .85-.85L12 2.5Z"
                  stroke="currentColor"
                  stroke-width="1.55"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.4 15.2 19 17.5l2.3.6-2.3.6-.6 2.3-.6-2.3-2.3-.6 2.3-.6.6-2.3Z"
                  stroke="currentColor"
                  stroke-width="1.45"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="fs-home-hero__point-text">{{ point.title }}</span>
          </li>
        </ul>

        <div class="fs-home-hero__actions">
          <a class="fs-home-hero__btn fs-home-hero__btn--brand" href="/guide/quick-start">
            开始使用
          </a>
          <a class="fs-home-hero__btn fs-home-hero__btn--alt" href="/guide/what-is-flow-shield">
            查看文档
          </a>
        </div>
      </div>

      <div class="fs-home-hero__visual">
        <HeroStack3D :track-el="heroRoot" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.fs-home-hero {
  margin-top: calc((var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1);
  padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 40px) 24px 40px;
}

.fs-home-hero__inner {
  display: grid;
  gap: 36px;
  align-items: center;
  max-width: 1152px;
  margin: 0 auto;
}

.fs-home-hero__heading {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  line-height: 1.15;
}

.fs-home-hero__name {
  width: fit-content;
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  background: var(--vp-home-hero-name-background);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.fs-home-hero__text {
  font-size: clamp(1.65rem, 3.6vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.fs-home-hero__tagline {
  margin: 16px 0 0;
  max-width: 34em;
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  line-height: 1.65;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.fs-home-hero__points {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 28px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.fs-home-hero__point {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
}

.fs-home-hero__point-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: inherit;
}

.fs-home-hero__point-icon svg {
  width: 15px;
  height: 15px;
}

.fs-home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.fs-home-hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 124px;
  height: 44px;
  padding: 0 22px;
  border-radius: 10px;
  font-size: 0.98rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.fs-home-hero__btn--brand {
  color: #fff;
  background: var(--vp-c-brand-1);
}

.fs-home-hero__btn--brand:hover {
  background: var(--vp-c-brand-2);
}

.fs-home-hero__btn--alt {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent);
}

.fs-home-hero__btn--alt:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 45%, transparent);
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
}

.fs-home-hero__visual {
  min-width: 0;
}

@media (min-width: 640px) {
  .fs-home-hero {
    padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 64px) 48px 56px;
  }

  .fs-home-hero__points {
    gap: 12px 36px;
  }
}

@media (min-width: 960px) {
  .fs-home-hero {
    padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 72px) 64px 64px;
  }

  .fs-home-hero__inner {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: 48px;
  }

  .fs-home-hero__visual {
    order: 2;
  }

}

@media (max-width: 960px) {
  .fs-home-hero__copy {
    order: 2;
    text-align: center;
  }

  .hero-stack {
    order: 1;
  }

  .fs-home-hero__copy>* {
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
  }
}



</style>
