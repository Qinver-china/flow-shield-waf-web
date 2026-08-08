<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  /** 鼠标跟随作用范围；首页传入整个 .fs-home-hero */
  trackEl?: HTMLElement | null
}>()

/** 替换同路径文件即可换图；也可改成 .png */
const images = [
  { src: '/images/hero/hero-1.png', alt: '流盾 WAF 界面' }
] as const

const root = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const reduceMotion = ref(false)
const active = ref(false)

const maxTilt = 12
let trackTarget: HTMLElement | null = null
let rect = { left: 0, top: 0, width: 1, height: 1 }
let pendingX = 0
let pendingY = 0
let rafId = 0
let resizeObserver: ResizeObserver | null = null

function cacheRect() {
  if (!trackTarget) return
  const r = trackTarget.getBoundingClientRect()
  rect = { left: r.left, top: r.top, width: r.width || 1, height: r.height || 1 }
}

function applyTransform(rx: number, ry: number) {
  const el = stageEl.value
  if (!el) return
  // translateZ(0) 促发合成层；整段 transform 只走 GPU
  el.style.transform = `translate3d(0,0,0) rotateX(${rx}deg) rotateY(${ry}deg)`
}

function flush() {
  rafId = 0
  applyTransform(pendingX, pendingY)
}

function schedule(rx: number, ry: number) {
  pendingX = rx
  pendingY = ry
  if (rafId) return
  rafId = requestAnimationFrame(flush)
}

function onPointerMove(e: PointerEvent) {
  if (reduceMotion.value || !trackTarget) return

  const px = (e.clientX - rect.left) / rect.width - 0.5
  const py = (e.clientY - rect.top) / rect.height - 0.5
  const ry = px * maxTilt * 2
  const rx = -py * maxTilt * 2

  if (!active.value) {
    active.value = true
    cacheRect()
  }

  schedule(rx, ry)
}

function onPointerEnter() {
  cacheRect()
}

function onPointerLeave() {
  active.value = false
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
  pendingX = 0
  pendingY = 0
  applyTransform(0, 0)
}

function onScrollOrResize() {
  if (active.value) cacheRect()
}

function unbindTrack() {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (!trackTarget) return
  trackTarget.removeEventListener('pointerenter', onPointerEnter)
  trackTarget.removeEventListener('pointermove', onPointerMove)
  trackTarget.removeEventListener('pointerleave', onPointerLeave)
  trackTarget = null
}

function bindTrack(el: HTMLElement | null | undefined) {
  unbindTrack()
  const next = el || root.value
  if (!next) return

  trackTarget = next
  cacheRect()
  trackTarget.addEventListener('pointerenter', onPointerEnter, { passive: true })
  trackTarget.addEventListener('pointermove', onPointerMove, { passive: true })
  trackTarget.addEventListener('pointerleave', onPointerLeave, { passive: true })

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => cacheRect())
    resizeObserver.observe(trackTarget)
  }
}

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  bindTrack(props.trackEl)
  window.addEventListener('scroll', onScrollOrResize, { passive: true })
  window.addEventListener('resize', onScrollOrResize, { passive: true })
})

watch(
  () => props.trackEl,
  (el) => bindTrack(el)
)

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  unbindTrack()
  window.removeEventListener('scroll', onScrollOrResize)
  window.removeEventListener('resize', onScrollOrResize)
})
</script>

<template>
  <div ref="root" class="hero-stack" :class="{ 'is-active': active, 'is-static': reduceMotion }">
    <div class="hero-stack__glow" aria-hidden="true" />
    <div ref="stageEl" class="hero-stack__stage">
      <figure v-for="(image, index) in images" :key="image.src" class="hero-stack__card"
        :class="`hero-stack__card--${index}`">
        <img :src="image.src" :alt="image.alt" loading="eager" decoding="async" />
      </figure>
    </div>
  </div>
</template>

<style scoped>
.hero-stack {
  position: relative;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  aspect-ratio: 4 / 3;
  perspective: 900px;
  perspective-origin: 50% 50%;
  touch-action: pan-y;
  pointer-events: none;
  transform: translateZ(0);
  contain: layout style;
}

.hero-stack__glow {
  position: absolute;
  inset: 12% 8%;
  border-radius: 50%;
  background-image: var(--vp-home-hero-image-background-image);
  filter: var(--vp-home-hero-image-filter);
  opacity: 0.85;
  pointer-events: none;
  z-index: 0;
  transform: translate3d(0, 0, 0);
  will-change: auto;
  contain: strict;
}

.hero-stack__stage {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  transform: translate3d(0, 0, 0);
  transform-style: preserve-3d;
  transform-origin: center center;
  backface-visibility: hidden;
  will-change: transform;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 跟随中取消过渡，直接上合成层变换，避免过渡插值抢帧 */
.hero-stack.is-active .hero-stack__stage {
  transition: none;
}

.hero-stack.is-static .hero-stack__stage {
  transform: none !important;
  transition: none;
  will-change: auto;
}

.hero-stack__card {
  position: absolute;
  margin: 0;
  width: 72%;
  border-radius: 14px;
  overflow: hidden;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  /* 静态错位用独立合成层，避免跟随时整树重绘 */
  will-change: transform;
}

.hero-stack__card img {
  display: block;
  width: 100%;
  height: auto;
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-user-drag: none;
  user-select: none;
}

.hero-stack__card--0 {
  top: 8%;
  left: 4%;
  z-index: 1;
}

.hero-stack__card--1 {
  top: 18%;
  left: 16%;
  z-index: 2;
  transform: translate3d(0, 0, 0) rotate(2deg);
}

.hero-stack__card--2 {
  top: 28%;
  left: 28%;
  z-index: 3;
  transform: translate3d(0, 0, 48px) rotate(6deg);
}

@media (max-width: 959px) {
  .hero-stack {
    max-width: 420px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-stack__stage,
  .hero-stack__card {
    transition: none !important;
  }

}
</style>
