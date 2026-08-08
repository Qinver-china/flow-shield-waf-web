<script setup lang="ts">
import { useId } from 'vue'

withDefaults(
  defineProps<{
    title: string
    description?: string
    /** 标题层级，默认 h2 */
    level?: 2 | 3
  }>(),
  {
    level: 2
  }
)

const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const gradId = `fs-heading-rule-${uid}`
const gradDarkId = `fs-heading-rule-dark-${uid}`
</script>

<template>
  <header class="fs-section-heading">
    <div class="fs-section-heading__title-wrap">
      <component :is="`h${level}`" class="fs-section-heading__title">
        {{ title }}
      </component>
      <svg
        class="fs-section-heading__rule"
        viewBox="0 0 200 18"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient :id="gradId" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stop-color="#081a3d" />
            <stop offset="45%" stop-color="#3474ff" />
            <stop offset="100%" stop-color="#22c55e" />
          </linearGradient>
          <linearGradient :id="gradDarkId" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stop-color="#8076ff" />
            <stop offset="50%" stop-color="#5193ff" />
            <stop offset="100%" stop-color="#22c55e" />
          </linearGradient>
        </defs>
        <!-- 手写感波浪下划线：轻微起伏 + 两端略翘 -->
        <path
          class="fs-section-heading__rule-path fs-section-heading__rule-path--light"
          d="M4 11.5 C 28 6.5, 52 15.5, 78 10.5 S 128 5.5, 152 11.2 S 182 14.8, 196 8.5"
          fill="none"
          :stroke="`url(#${gradId})`"
          stroke-width="7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          class="fs-section-heading__rule-path fs-section-heading__rule-path--dark"
          d="M4 11.5 C 28 6.5, 52 15.5, 78 10.5 S 128 5.5, 152 11.2 S 182 14.8, 196 8.5"
          fill="none"
          :stroke="`url(#${gradDarkId})`"
          stroke-width="7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <p v-if="description" class="fs-section-heading__desc">{{ description }}</p>
  </header>
</template>

<style scoped>
.fs-section-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}

.fs-section-heading__title-wrap {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
}

.fs-section-heading__title {
  margin: 0;
  font-size: clamp(1.65rem, 3.2vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
  background: var(--vp-home-hero-name-background);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.fs-section-heading__rule {
  display: block;
  width: min(148px, 58%);
  height: 14px;
  margin-top: 6px;
  overflow: visible;
}

.fs-section-heading__rule-path--dark {
  display: none;
}

:global(.dark) .fs-section-heading__rule-path--light {
  display: none;
}

:global(.dark) .fs-section-heading__rule-path--dark {
  display: inline;
}

.fs-section-heading__desc {
  margin: 16px 0 0;
  max-width: 36em;
  font-size: clamp(0.95rem, 1.4vw, 1.05rem);
  line-height: 1.7;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
</style>
