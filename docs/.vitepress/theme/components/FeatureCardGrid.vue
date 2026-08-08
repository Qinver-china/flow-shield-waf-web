<script setup lang="ts">
import { computed } from 'vue'
import SectionHeading from './SectionHeading.vue'

export type FeatureCardItem = {
  title: string
  description: string
  /** 内置图标名；也可配合 iconSrc 使用自定义图 */
  icon?: 'zap' | 'rules' | 'ai' | 'deploy' | 'shield' | 'logs' | 'puzzle' | 'network'
  /** 自定义图标图片路径（优先于 icon） */
  iconSrc?: string
}

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    cards: FeatureCardItem[]
    /** 移动端每行列数：2 / 3 / 4 */
    mobileCols?: 2 | 3 | 4
  }>(),
  {
    mobileCols: 2
  }
)

const gridStyle = computed(() => ({
  '--fs-card-cols-mobile': String(props.mobileCols)
}))

/** 按顺序循环 6 套淡色主题 */
function toneClass(index: number) {
  return `tone-${index % 6}`
}
</script>

<template>
  <section class="fs-feature-cards" :aria-label="title">
    <div class="fs-feature-cards__inner">
      <SectionHeading :title="title" :description="description" />

      <ul class="fs-feature-cards__grid" :style="gridStyle">
        <li v-for="(card, i) in cards" :key="`${card.title}-${i}`" class="fs-feature-cards__card" :class="toneClass(i)">
          <span class="fs-feature-cards__icon" aria-hidden="true">
            <img v-if="card.iconSrc" :src="card.iconSrc" alt="" />
            <svg v-else-if="card.icon === 'zap'" viewBox="0 0 24 24" fill="none">
              <path d="M13 2 4 13.5h6.5L11 22l9-11.5h-6.5L13 2Z" stroke="currentColor" stroke-width="1.7"
                stroke-linejoin="round" />
            </svg>
            <svg v-else-if="card.icon === 'rules'" viewBox="0 0 24 24" fill="none">
              <path d="M8 6h12M8 12h12M8 18h12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              <circle cx="4.5" cy="6" r="1.4" fill="currentColor" />
              <circle cx="4.5" cy="12" r="1.4" fill="currentColor" />
              <circle cx="4.5" cy="18" r="1.4" fill="currentColor" />
            </svg>
            <svg v-else-if="card.icon === 'ai'" viewBox="0 0 24 24" fill="none">
              <path d="M12 3c-2.8 3.2-4.5 5.9-4.5 8.6a4.5 4.5 0 0 0 9 0C16.5 8.9 14.8 6.2 12 3Z" stroke="currentColor"
                stroke-width="1.7" stroke-linejoin="round" />
              <path d="M9.5 14.5c.6 1.4 1.5 2.3 2.5 3 1-.7 1.9-1.6 2.5-3" stroke="currentColor" stroke-width="1.7"
                stroke-linecap="round" />
            </svg>
            <svg v-else-if="card.icon === 'deploy'" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M5 16.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2.5" stroke="currentColor" stroke-width="1.7"
                stroke-linecap="round" />
            </svg>
            <svg v-else-if="card.icon === 'shield'" viewBox="0 0 24 24" fill="none">
              <path d="M12 3 5 6v5.5c0 4.2 2.8 7.4 7 8.5 4.2-1.1 7-4.3 7-8.5V6l-7-3Z" stroke="currentColor"
                stroke-width="1.7" stroke-linejoin="round" />
            </svg>
            <svg v-else-if="card.icon === 'logs'" viewBox="0 0 24 24" fill="none">
              <path d="M7 4h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z" stroke="currentColor"
                stroke-width="1.7" stroke-linejoin="round" />
              <path d="M9 9h6M9 13h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
            <svg v-else-if="card.icon === 'puzzle'" viewBox="0 0 24 24" fill="none">
              <path
                d="M10 4h4v2.2a1.8 1.8 0 1 0 0 3.6V12h2.2a1.8 1.8 0 1 0 3.6 0H22v4h-2.2a1.8 1.8 0 1 0-3.6 0H12v-2.2a1.8 1.8 0 1 0-3.6 0V16H4v-4h2.2a1.8 1.8 0 1 0 0-3.6H4V4h4v2.2a1.8 1.8 0 1 0 3.6 0V4Z"
                stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none">
              <circle cx="7" cy="8" r="2.2" stroke="currentColor" stroke-width="1.7" />
              <circle cx="17" cy="8" r="2.2" stroke="currentColor" stroke-width="1.7" />
              <circle cx="12" cy="16" r="2.2" stroke="currentColor" stroke-width="1.7" />
              <path d="M9 9.2 10.8 14M15 9.2 13.2 14M9.2 8h5.6" stroke="currentColor" stroke-width="1.7"
                stroke-linecap="round" />
            </svg>
          </span>

          <h3 class="fs-feature-cards__card-title">{{ card.title }}</h3>
          <p class="fs-feature-cards__card-desc">{{ card.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.fs-feature-cards {
  padding: 28px 24px 64px;
}

.fs-feature-cards__inner {
  max-width: 1152px;
  margin: 0 auto;
}

.fs-feature-cards__grid {
  display: grid;
  grid-template-columns: repeat(var(--fs-card-cols-mobile, 2), minmax(0, 1fr));
  gap: 14px;
  margin: 40px 0 0;
  padding: 0;
  list-style: none;
}

.fs-feature-cards__card {
  --fs-tone-accent: #3474ff;
  --fs-tone-icon-bg: rgba(52, 116, 255, 0.12);
  --fs-tone-glow-a: rgba(52, 116, 255, 0.22);
  --fs-tone-glow-b: rgba(52, 116, 255, 0.06);

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-height: 100%;
  padding: 22px 18px 24px;
  border-radius: 18px;
  background: var(--vp-feature-cards-bg, #f8f8f8b8);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
  overflow: hidden;
  isolation: isolate;
}

:global(.dark) .fs-feature-cards__card {
  --vp-feature-cards-bg: rgba(30, 41, 59, 0.8);
}

.fs-feature-cards__card::before {
  content: "";
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(170deg, var(--fs-tone-glow-b) 10%, transparent 50%);
  pointer-events: none;
}

.fs-feature-cards__icon,
.fs-feature-cards__card-title,
.fs-feature-cards__card-desc {
  position: relative;
  z-index: 1;
}

/* 1 紫粉 */
.fs-feature-cards__card.tone-0 {
  --fs-tone-accent: #8b5cf6;
  --fs-tone-icon-bg: rgba(139, 92, 246, 0.14);
  --fs-tone-glow-a: rgba(192, 132, 252, 0.34);
  --fs-tone-glow-b: rgba(225, 114, 244, 0.12);
}

/* 2 珊瑚橙 */
.fs-feature-cards__card.tone-1 {
  --fs-tone-accent: #f97316;
  --fs-tone-icon-bg: rgba(249, 115, 22, 0.14);
  --fs-tone-glow-a: rgba(251, 146, 60, 0.34);
  --fs-tone-glow-b: rgba(253, 201, 71, 0.14);
}

/* 3 天蓝 */
.fs-feature-cards__card.tone-2 {
  --fs-tone-accent: #3b82f6;
  --fs-tone-icon-bg: rgba(59, 130, 246, 0.14);
  --fs-tone-glow-a: rgba(96, 165, 250, 0.34);
  --fs-tone-glow-b: rgba(125, 210, 252, 0.14);
}

/* 4 青绿 */
.fs-feature-cards__card.tone-3 {
  --fs-tone-accent: #14b8a6;
  --fs-tone-icon-bg: rgba(20, 184, 166, 0.14);
  --fs-tone-glow-a: rgba(45, 212, 191, 0.32);
  --fs-tone-glow-b: rgba(110, 231, 207, 0.12);
}

/* 5 翠绿 */
.fs-feature-cards__card.tone-4 {
  --fs-tone-accent: #22c55e;
  --fs-tone-icon-bg: rgba(34, 197, 94, 0.14);
  --fs-tone-glow-a: rgba(74, 222, 128, 0.32);
  --fs-tone-glow-b: rgba(89, 252, 103, 0.12);
}

/* 6 玫红 */
.fs-feature-cards__card.tone-5 {
  --fs-tone-accent: #ec4899;
  --fs-tone-icon-bg: rgba(236, 72, 153, 0.14);
  --fs-tone-glow-a: rgba(244, 114, 182, 0.32);
  --fs-tone-glow-b: rgba(251, 113, 184, 0.12);
}

:global(.dark) .fs-feature-cards__card {
  background: rgba(30, 41, 59, 0.78);
  border-color: color-mix(in srgb, var(--fs-tone-accent) 16%, transparent);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
}

/* 夜间：光晕略提亮但仍保持淡；图标色略提亮保证可读 */
:global(.dark) .fs-feature-cards__card.tone-0 {
  --fs-tone-accent: #c4b5fd;
  --fs-tone-icon-bg: rgba(167, 139, 250, 0.2);
  --fs-tone-glow-a: rgba(167, 139, 250, 0.28);
  --fs-tone-glow-b: rgba(244, 114, 182, 0.1);
}

:global(.dark) .fs-feature-cards__card.tone-1 {
  --fs-tone-accent: #fdba74;
  --fs-tone-icon-bg: rgba(251, 146, 60, 0.2);
  --fs-tone-glow-a: rgba(251, 146, 60, 0.28);
  --fs-tone-glow-b: rgba(253, 224, 71, 0.1);
}

:global(.dark) .fs-feature-cards__card.tone-2 {
  --fs-tone-accent: #93c5fd;
  --fs-tone-icon-bg: rgba(96, 165, 250, 0.2);
  --fs-tone-glow-a: rgba(96, 165, 250, 0.28);
  --fs-tone-glow-b: rgba(125, 211, 252, 0.1);
}

:global(.dark) .fs-feature-cards__card.tone-3 {
  --fs-tone-accent: #5eead4;
  --fs-tone-icon-bg: rgba(45, 212, 191, 0.2);
  --fs-tone-glow-a: rgba(45, 212, 191, 0.26);
  --fs-tone-glow-b: rgba(110, 231, 183, 0.1);
}

:global(.dark) .fs-feature-cards__card.tone-4 {
  --fs-tone-accent: #86efac;
  --fs-tone-icon-bg: rgba(74, 222, 128, 0.2);
  --fs-tone-glow-a: rgba(74, 222, 128, 0.26);
  --fs-tone-glow-b: rgba(190, 242, 100, 0.1);
}

:global(.dark) .fs-feature-cards__card.tone-5 {
  --fs-tone-accent: #f9a8d4;
  --fs-tone-icon-bg: rgba(244, 114, 182, 0.2);
  --fs-tone-glow-a: rgba(244, 114, 182, 0.26);
  --fs-tone-glow-b: rgba(251, 113, 133, 0.1);
}

.fs-feature-cards__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: var(--fs-tone-accent);
  background: var(--fs-tone-icon-bg);
}

.fs-feature-cards__icon svg,
.fs-feature-cards__icon img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.fs-feature-cards__card-title {
  margin: 4px 0 0;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--vp-c-text-1);
}

.fs-feature-cards__card-desc {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.65;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

@media (min-width: 640px) {
  .fs-feature-cards {
    padding: 36px 48px 80px;
  }

  .fs-feature-cards__grid {
    gap: 18px;
    margin-top: 48px;
  }

  .fs-feature-cards__card {
    padding: 26px 22px 28px;
  }
}

@media (min-width: 960px) {
  .fs-feature-cards {
    padding: 40px 64px 96px;
  }

  .fs-feature-cards__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
  }

  .fs-feature-cards__card {
    padding: 28px 24px 30px;
  }

  .fs-feature-cards__card-title {
    font-size: 1.12rem;
  }
}
</style>
