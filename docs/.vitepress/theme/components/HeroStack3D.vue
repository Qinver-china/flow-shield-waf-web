<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import HeroMarkSvg from './HeroMarkSvg.vue'

const props = defineProps<{
  /** 鼠标跟随作用范围；首页传入整个 .fs-home-hero */
  trackEl?: HTMLElement | null
}>()

const root = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const markRef = ref<{
  setParallax: (nx: number, ny: number, active: boolean) => void
} | null>(null)

const reduceMotion = ref(false)
const active = ref(false)

const maxTilt = 10
/** 跟随时略快，回弹时稍慢，手感更顺 */
const LERP_FOLLOW = 0.14
const LERP_RETURN = 0.08
const SETTLE = 0.001

let trackTarget: HTMLElement | null = null
let rect = { left: 0, top: 0, width: 1, height: 1 }
let resizeObserver: ResizeObserver | null = null

let targetRx = 0
let targetRy = 0
let targetNx = 0
let targetNy = 0
let curRx = 0
let curRy = 0
let curNx = 0
let curNy = 0
let loopRaf = 0
let pointerInside = false

function cacheRect() {
  if (!trackTarget) return
  const r = trackTarget.getBoundingClientRect()
  rect = { left: r.left, top: r.top, width: r.width || 1, height: r.height || 1 }
}

function applyStage(rx: number, ry: number) {
  const el = stageEl.value
  if (!el) return
  el.style.transform = `translate3d(0,0,0) rotateX(${rx}deg) rotateY(${ry}deg)`
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function nearlyZero(...vals: number[]) {
  return vals.every((v) => Math.abs(v) < SETTLE)
}

function tick() {
  if (reduceMotion.value) {
    loopRaf = 0
    return
  }

  const k = pointerInside ? LERP_FOLLOW : LERP_RETURN
  curRx = lerp(curRx, targetRx, k)
  curRy = lerp(curRy, targetRy, k)
  curNx = lerp(curNx, targetNx, k)
  curNy = lerp(curNy, targetNy, k)

  if (!pointerInside && nearlyZero(curRx, curRy, curNx, curNy, targetRx, targetRy)) {
    curRx = curRy = curNx = curNy = 0
    targetRx = targetRy = targetNx = targetNy = 0
    applyStage(0, 0)
    markRef.value?.setParallax(0, 0, false)
    active.value = false
    loopRaf = 0
    return
  }

  applyStage(curRx, curRy)
  markRef.value?.setParallax(curNx, curNy, pointerInside || !nearlyZero(curNx, curNy))
  active.value = pointerInside || !nearlyZero(curRx, curRy, curNx, curNy)
  loopRaf = requestAnimationFrame(tick)
}

function ensureLoop() {
  if (reduceMotion.value || loopRaf) return
  loopRaf = requestAnimationFrame(tick)
}

function onPointerMove(e: PointerEvent) {
  if (reduceMotion.value || !trackTarget) return

  const nx = (e.clientX - rect.left) / rect.width - 0.5
  const ny = (e.clientY - rect.top) / rect.height - 0.5
  targetNx = nx
  targetNy = ny
  targetRy = nx * maxTilt * 2
  targetRx = -ny * maxTilt * 2
  pointerInside = true
  active.value = true
  ensureLoop()
}

function onPointerEnter() {
  cacheRect()
  pointerInside = true
  active.value = true
  ensureLoop()
}

function onPointerLeave() {
  pointerInside = false
  targetRx = 0
  targetRy = 0
  targetNx = 0
  targetNy = 0
  ensureLoop()
}

function onScrollOrResize() {
  if (pointerInside || active.value) cacheRect()
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
  if (loopRaf) cancelAnimationFrame(loopRaf)
  unbindTrack()
  window.removeEventListener('scroll', onScrollOrResize)
  window.removeEventListener('resize', onScrollOrResize)
})
</script>

<template>
  <div
    ref="root"
    class="hero-stack"
    :class="{ 'is-active': active, 'is-static': reduceMotion }"
  >
    <div class="hero-stack__glow" aria-hidden="true" />
    <div ref="stageEl" class="hero-stack__stage">
      <HeroMarkSvg ref="markRef" :reduce-motion="reduceMotion" />
    </div>
  </div>
</template>

<style scoped>
.hero-stack {
  position: relative;
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 900px;
  perspective-origin: 50% 50%;
  touch-action: pan-y;
  pointer-events: none;
  transform: translateZ(0);
  contain: layout style;
}

.hero-stack__glow {
  position: absolute;
  inset: 8% 6%;
  border-radius: 50%;
  background-image: var(--vp-home-hero-image-background-image);
  filter: var(--vp-home-hero-image-filter);
  opacity: 0.85;
  pointer-events: none;
  z-index: 0;
  transform: translate3d(0, 0, 0);
  contain: strict;
  transition:
    opacity 0.45s ease,
    filter 0.45s ease,
    background 0.45s ease;
}

.hero-stack__stage {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate3d(0, 0, 0);
  transform-style: preserve-3d;
  transform-origin: center center;
  backface-visibility: hidden;
  will-change: transform;
}

.hero-stack.is-static .hero-stack__stage {
  transform: none !important;
  will-change: auto;
}

@media (max-width: 959px) {
  .hero-stack {
    max-width: 340px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-stack__glow {
    transition: none !important;
  }

  .hero-stack.is-active .hero-stack__glow {
    filter: var(--vp-home-hero-image-filter);
    opacity: 0.85;
    background-image: var(--vp-home-hero-image-background-image);
  }
}
</style>
