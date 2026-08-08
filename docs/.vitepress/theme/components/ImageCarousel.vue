<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

export type CarouselSlide = {
  src: string
  alt?: string
}

const props = withDefaults(
  defineProps<{
    slides: CarouselSlide[]
    /** 自动轮播间隔（ms），0 关闭 */
    interval?: number
    /** 淡入淡出时长（ms） */
    duration?: number
  }>(),
  {
    interval: 5000,
    duration: 520
  }
)

const index = ref(0)
const reduceMotion = ref(false)
const dragging = ref(false)
const dragOffset = ref(0)

let timer: ReturnType<typeof setInterval> | null = null
let pointerId: number | null = null
let startX = 0
let startY = 0
let axis: 'x' | 'y' | null = null

const count = computed(() => props.slides.length)
const fadeMs = computed(() => (reduceMotion.value ? 0 : props.duration))

function goTo(next: number) {
  if (count.value <= 0) return
  index.value = ((next % count.value) + count.value) % count.value
  restartTimer()
}

function prev() {
  goTo(index.value - 1)
}

function next() {
  goTo(index.value + 1)
}

function clearTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function restartTimer() {
  clearTimer()
  if (reduceMotion.value || props.interval <= 0 || count.value <= 1) return
  timer = setInterval(() => {
    index.value = (index.value + 1) % count.value
  }, props.interval)
}

function onPointerDown(e: PointerEvent) {
  if (count.value <= 1 || e.button !== 0) return
  pointerId = e.pointerId
  startX = e.clientX
  startY = e.clientY
  axis = null
  dragging.value = true
  dragOffset.value = 0
  clearTimer()
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || pointerId !== e.pointerId) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  if (!axis) {
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
    axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
  }
  if (axis === 'y') return
  e.preventDefault()
  dragOffset.value = dx
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value || pointerId !== e.pointerId) return
  const dx = dragOffset.value
  dragging.value = false
  dragOffset.value = 0
  pointerId = null
  axis = null

  const threshold = 56
  if (dx <= -threshold) next()
  else if (dx >= threshold) prev()
  else restartTimer()
}

function onPointerCancel() {
  dragging.value = false
  dragOffset.value = 0
  pointerId = null
  axis = null
  restartTimer()
}

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  restartTimer()
})

onUnmounted(() => {
  clearTimer()
})
</script>

<template>
  <div
    class="fs-carousel"
    :class="{ 'is-dragging': dragging }"
    role="region"
    aria-roledescription="carousel"
    aria-label="界面展示轮播"
  >
    <div
      class="fs-carousel__viewport"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
    >
      <figure
        v-for="(slide, i) in slides"
        :key="slide.src"
        class="fs-carousel__slide"
        :class="{ 'is-active': i === index }"
        :style="{ transitionDuration: `${fadeMs}ms` }"
        :aria-hidden="i === index ? 'false' : 'true'"
      >
        <img
          class="no-zoom"
          :src="slide.src"
          :alt="slide.alt || `展示图 ${i + 1}`"
          :loading="i === 0 ? 'eager' : 'lazy'"
          decoding="async"
          draggable="false"
        />
      </figure>
    </div>

    <button
      v-if="count > 1"
      type="button"
      class="fs-carousel__nav fs-carousel__nav--prev"
      aria-label="上一张"
      @click="prev"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M15 5 8 12l7 7"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <button
      v-if="count > 1"
      type="button"
      class="fs-carousel__nav fs-carousel__nav--next"
      aria-label="下一张"
      @click="next"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="m9 5 7 7-7 7"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div v-if="count > 1" class="fs-carousel__dots" role="tablist" aria-label="轮播指示">
      <button
        v-for="(_, i) in slides"
        :key="i"
        type="button"
        class="fs-carousel__dot"
        :class="{ 'is-active': i === index }"
        :aria-label="`第 ${i + 1} 张`"
        :aria-selected="i === index"
        @click="goTo(i)"
      />
    </div>
  </div>
</template>

<style scoped>
.fs-carousel {
  position: relative;
  width: 100%;
  margin: 0 auto;
  user-select: none;
  touch-action: pan-y;
}

.fs-carousel__viewport {
  position: relative;
  width: 100%;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  cursor: grab;
}

.fs-carousel.is-dragging .fs-carousel__viewport {
  cursor: grabbing;
}

.fs-carousel__slide {
  position: absolute;
  inset: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition-property: opacity;
  transition-timing-function: ease;
  z-index: 0;
}

.fs-carousel__slide.is-active {
  opacity: 1;
  pointer-events: auto;
  z-index: 1;
}

.fs-carousel__slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
}

.fs-carousel__nav {
  position: absolute;
  top: 50%;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent);
  border-radius: 999px;
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--fs-bg-page) 78%, transparent);
  backdrop-filter: blur(8px);
  transform: translateY(-50%);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease;
  opacity: 0.72;
}

.fs-carousel__nav:hover {
  opacity: 1;
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 36%, transparent);
}

.fs-carousel__nav--prev {
  left: -60px;
}

.fs-carousel__nav--next {
  right: -60px;
}

.fs-carousel__nav svg {
  width: 18px;
  height: 18px;
}

.fs-carousel__dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
}

.fs-carousel__dot {
  width: 8px;
  height: 8px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-text-2) 35%, transparent);
  cursor: pointer;
  transition:
    width 0.2s ease,
    background-color 0.2s ease;
}

.fs-carousel__dot.is-active {
  width: 22px;
  background: var(--vp-c-brand-1);
}

@media (max-width: 960px) {
  .fs-carousel__nav--prev {
    left: -45px;
  }

  .fs-carousel__nav--next {
    right: -45px;
  }
}

@media (max-width: 639px) {
  .fs-carousel__nav {
    width: 34px;
    height: 34px;
  }

  .fs-carousel__nav--prev {
    left: 6px;
  }

  .fs-carousel__nav--next {
    right: 6px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fs-carousel__slide {
    transition: none !important;
  }
}
</style>
