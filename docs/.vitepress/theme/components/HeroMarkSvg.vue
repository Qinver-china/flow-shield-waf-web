<script setup lang="ts">
import { onMounted, onUnmounted, ref, useId, watch } from 'vue'

const props = defineProps<{
  /** 归一化鼠标 X：约 -0.5 ~ 0.5 */
  nx?: number
  /** 归一化鼠标 Y：约 -0.5 ~ 0.5 */
  ny?: number
  active?: boolean
  reduceMotion?: boolean
}>()

const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const grad1 = `hero-mark-g1-${uid}`
const grad2 = `hero-mark-g2-${uid}`
const grad3 = `hero-mark-g3-${uid}`

const rootSvg = ref<SVGSVGElement | null>(null)
const stemEl = ref<SVGGElement | null>(null)
const outerEl = ref<SVGGElement | null>(null)
const innerEl = ref<SVGGElement | null>(null)
const pixelsGroupEl = ref<SVGGElement | null>(null)
const pixelEls = ref<SVGPathElement[]>([])

const entered = ref(false)

let nx = 0
let ny = 0
let active = false
let targetNx = 0
let targetNy = 0
let targetActive = false
let floatRaf = 0
let startTs = 0

const LERP = 0.16
const SETTLE = 0.0008

const DEPTH = {
  stem: 10,
  outer: 22,
  inner: 30,
  pixels: 40
} as const

const PIXEL_META = [
  { ax: 1.1, ay: 0.9, phase: 0.2, scatter: 1.15 },
  { ax: 0.8, ay: 1.2, phase: 1.1, scatter: 1.35 },
  { ax: 1.3, ay: 0.7, phase: 2.0, scatter: 1.05 },
  { ax: 0.9, ay: 1.4, phase: 0.6, scatter: 1.45 },
  { ax: 1.2, ay: 1.0, phase: 1.7, scatter: 1.55 },
  { ax: 0.7, ay: 1.1, phase: 2.4, scatter: 1.25 },
  { ax: 1.0, ay: 1.3, phase: 0.9, scatter: 1.2 },
  { ax: 1.15, ay: 0.85, phase: 1.5, scatter: 1.1 },
  { ax: 0.95, ay: 1.05, phase: 2.8, scatter: 1.3 }
] as const

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function setLayer(el: SVGGElement | null, x: number, y: number, rot = 0) {
  if (!el) return
  el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${rot.toFixed(2)}deg)`
}

function setPixel(el: SVGPathElement | null, x: number, y: number) {
  if (!el) return
  el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`
}

function applyParallax(timeMs: number) {
  if (props.reduceMotion) {
    setLayer(stemEl.value, 0, 0)
    setLayer(outerEl.value, 0, 0)
    setLayer(innerEl.value, 0, 0)
    setLayer(pixelsGroupEl.value, 0, 0)
    for (const el of pixelEls.value) setPixel(el, 0, 0)
    return
  }

  nx = lerp(nx, targetNx, LERP)
  ny = lerp(ny, targetNy, LERP)
  if (!targetActive && Math.abs(nx) < SETTLE && Math.abs(ny) < SETTLE) {
    nx = 0
    ny = 0
  }

  const t = (timeMs - startTs) / 1000
  active = targetActive || Math.abs(nx) > SETTLE || Math.abs(ny) > SETTLE

  const dx = nx * 2
  const dy = ny * 2
  // 强度随位移平滑变化，移出时自然减弱而不是硬切
  const s = lerp(0.28, 1, Math.min(1, Math.hypot(nx, ny) * 3.2 + (targetActive ? 0.55 : 0)))

  setLayer(stemEl.value, dx * DEPTH.stem * s, dy * DEPTH.stem * s, dx * 1.2 * s)
  setLayer(outerEl.value, dx * DEPTH.outer * s, dy * DEPTH.outer * s, dx * 2.2 * s)
  setLayer(innerEl.value, dx * DEPTH.inner * s, dy * DEPTH.inner * s, -dx * 1.6 * s)
  setLayer(pixelsGroupEl.value, dx * DEPTH.pixels * s, dy * DEPTH.pixels * s, dx * 3 * s)

  const scatterBase = 3 + (s - 0.28) * 10

  for (let i = 0; i < pixelEls.value.length; i++) {
    const meta = PIXEL_META[i] || PIXEL_META[0]
    const floatX = Math.sin(t * 1.3 + meta.phase) * 1.6 * meta.ax
    const floatY = Math.cos(t * 1.1 + meta.phase) * 1.8 * meta.ay
    const scatterX = dx * scatterBase * meta.scatter
    const scatterY = dy * scatterBase * meta.scatter
    setPixel(pixelEls.value[i], floatX + scatterX, floatY + scatterY)
  }
}

function tick(now: number) {
  if (!startTs) startTs = now
  applyParallax(now)
  floatRaf = requestAnimationFrame(tick)
}

function setParallax(nextNx: number, nextNy: number, nextActive: boolean) {
  targetNx = nextNx
  targetNy = nextNy
  targetActive = nextActive
}

function collectPixels() {
  const group = pixelsGroupEl.value
  if (!group) {
    pixelEls.value = []
    return
  }
  pixelEls.value = Array.from(group.querySelectorAll<SVGPathElement>('.hero-mark__pixel'))
}

onMounted(() => {
  collectPixels()
  requestAnimationFrame(() => {
    entered.value = true
  })
  if (!props.reduceMotion) {
    floatRaf = requestAnimationFrame(tick)
  }
})

watch(
  () => props.reduceMotion,
  (v) => {
    if (v) {
      if (floatRaf) cancelAnimationFrame(floatRaf)
      floatRaf = 0
      applyParallax(performance.now())
    } else if (!floatRaf) {
      floatRaf = requestAnimationFrame(tick)
    }
  }
)

watch(
  () => [props.nx, props.ny, props.active] as const,
  ([px, py, isActive]) => {
    if (px !== undefined) nx = px
    if (py !== undefined) ny = py
    if (isActive !== undefined) active = isActive
  }
)

onUnmounted(() => {
  if (floatRaf) cancelAnimationFrame(floatRaf)
})

defineExpose({ setParallax })
</script>

<template>
  <svg
    ref="rootSvg"
    class="hero-mark"
    :class="{ 'is-entered': entered, 'is-static': reduceMotion }"
    viewBox="0 0 190.83781 167.16559"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="流盾 WAF"
  >
    <title>流盾 WAF</title>
    <defs>
      <linearGradient
        :id="grad1"
        gradientUnits="userSpaceOnUse"
        x1="-63.275566"
        y1="97.637222"
        x2="-26.584785"
        y2="115.06445"
      >
        <stop offset="0" stop-color="#55aaf5" />
        <stop offset="1" stop-color="#2c55df" />
      </linearGradient>
      <linearGradient
        :id="grad2"
        gradientUnits="userSpaceOnUse"
        x1="39.786045"
        y1="95.460136"
        x2="-39.626896"
        y2="180.62009"
      >
        <stop offset="0" stop-color="#67b5f8" />
        <stop offset="1" stop-color="#1841d3" />
      </linearGradient>
      <linearGradient
        :id="grad3"
        gradientUnits="userSpaceOnUse"
        x1="11.716701"
        y1="116.73811"
        x2="1.2399517"
        y2="153.27487"
      >
        <stop offset="0" stop-color="#5da7f3" />
        <stop offset="1" stop-color="#2c55df" />
      </linearGradient>
    </defs>

    <g class="hero-mark__mark" transform="translate(132.53744,-42.987515)">
      <g ref="stemEl" class="hero-mark__layer hero-mark__layer--stem">
        <path
          :fill="`url(#${grad1})`"
          d="M -66.71839,59.662756 V 169.34657 h 42.106109 V 145.17454 H -39.167479 L -39.17829,42.987515 Z"
        />
      </g>

      <g ref="outerEl" class="hero-mark__layer hero-mark__layer--outer">
        <path
          :fill="`url(#${grad2})`"
          d="m -27.991167,67.200269 v 16.634513 c 0,0 9.677427,-2.00125 14.180212,-2.00125 4.5027847,0 34.163838,1.221507 56.581441,14.867006 l 0.129961,39.896842 c 0,0 -0.324893,16.76446 -16.049705,32.74919 -15.724812,15.98473 -38.85718,24.69185 -38.85718,24.69185 0,0 -7.927385,-3.11897 -11.826099,-5.32824 -3.898713,-2.20927 -11.176312,-6.75777 -11.176312,-6.75777 l -23.132369,-0.12996 c 0,0 10.39657,11.04636 22.092712,17.15435 11.696141,6.10798 23.522239,11.17631 23.522239,11.17631 0,0 34.82851,-12.86576 51.203108,-31.96945 16.374597,-19.1037 19.062059,-36.38822 19.103697,-40.41667 l 0.519829,-50.293407 c 0,0 -28.031182,-19.339101 -70.598252,-21.511171 -5.557033,-0.283558 -15.693282,1.237857 -15.693282,1.237857 z"
        />
      </g>

      <g ref="innerEl" class="hero-mark__layer hero-mark__layer--inner">
        <path
          :fill="`url(#${grad3})`"
          d="m -12.526268,100.59925 0.129955,68.87728 c 0,0 12.9957177,1.42952 28.200696,-12.7358 9.718823,-9.05429 9.356913,-20.9231 9.356913,-20.9231 l 0.321627,-26.79481 c 0,0 -7.729182,-3.74511 -19.0354523,-6.47421 -11.3062701,-2.729103 -18.9737387,-1.94936 -18.9737387,-1.94936 z"
        />
      </g>

      <g ref="pixelsGroupEl" class="hero-mark__layer hero-mark__layer--pixels">
        <path
          class="hero-mark__pixel"
          data-i="0"
          fill="#5a90f3"
          d="m -90.909654,119.60179 v 7.71905 h 16.357052 V 119.418 Z"
        />
        <path
          class="hero-mark__pixel"
          data-i="1"
          fill="#3761dd"
          d="m -105.52073,119.50989 v 8.17853 h 8.178526 v -8.17853 z"
        />
        <path
          class="hero-mark__pixel"
          data-i="2"
          fill="#5a90f3"
          d="m -97.158416,133.29393 v 7.81095 h 22.605814 v -7.71906 z"
        />
        <path
          class="hero-mark__pixel"
          data-i="3"
          fill="#47c4ef"
          d="m -117.375,133.29393 v 8.08663 h 8.63799 v -8.17853 z"
        />
        <path
          class="hero-mark__pixel"
          data-i="4"
          fill="#47c4ef"
          d="m -132.53744,133.29393 v 7.99474 h 8.72989 v -7.99474 z"
        />
        <path
          class="hero-mark__pixel"
          data-i="5"
          fill="#5a90f3"
          d="m -96.698949,147.16985 v 7.90285 h 22.238242 v -7.90285 z"
        />
        <path
          class="hero-mark__pixel"
          data-i="6"
          fill="#3761dd"
          d="m -111.31003,147.16985 v 7.99474 h 8.36232 v -7.99474 z"
        />
        <path
          class="hero-mark__pixel"
          data-i="7"
          fill="#5a90f3"
          d="m -97.250311,161.22957 v 8.45421 h 8.546102 v -8.45421 z"
        />
        <path
          class="hero-mark__pixel"
          data-i="8"
          fill="#5a90f3"
          d="m -82.823022,161.22957 v 8.17853 h 8.454208 v -8.36232 z"
        />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.hero-mark {
  display: block;
  width: min(100%, 420px);
  height: auto;
  margin: 0 auto;
  overflow: visible;
  transform: translateZ(0);
}

.hero-mark__layer,
.hero-mark__pixel {
  transform-box: fill-box;
  transform-origin: center;
  will-change: transform;
  backface-visibility: hidden;
}

.hero-mark__layer--stem,
.hero-mark__layer--outer,
.hero-mark__layer--inner,
.hero-mark__layer--pixels,
.hero-mark__pixel {
  opacity: 0;
  transition:
    opacity 0.55s ease,
    filter 0.55s ease;
}

.hero-mark.is-entered .hero-mark__layer--stem {
  opacity: 1;
  transition-delay: 0.05s;
}

.hero-mark.is-entered .hero-mark__layer--outer {
  opacity: 1;
  transition-delay: 0.18s;
}

.hero-mark.is-entered .hero-mark__layer--inner {
  opacity: 1;
  transition-delay: 0.3s;
}

.hero-mark.is-entered .hero-mark__layer--pixels {
  opacity: 1;
  transition-delay: 0.4s;
}

.hero-mark.is-entered .hero-mark__pixel {
  opacity: 1;
}

.hero-mark.is-entered .hero-mark__pixel:nth-child(1) { transition-delay: 0.42s; }
.hero-mark.is-entered .hero-mark__pixel:nth-child(2) { transition-delay: 0.46s; }
.hero-mark.is-entered .hero-mark__pixel:nth-child(3) { transition-delay: 0.5s; }
.hero-mark.is-entered .hero-mark__pixel:nth-child(4) { transition-delay: 0.54s; }
.hero-mark.is-entered .hero-mark__pixel:nth-child(5) { transition-delay: 0.58s; }
.hero-mark.is-entered .hero-mark__pixel:nth-child(6) { transition-delay: 0.62s; }
.hero-mark.is-entered .hero-mark__pixel:nth-child(7) { transition-delay: 0.66s; }
.hero-mark.is-entered .hero-mark__pixel:nth-child(8) { transition-delay: 0.7s; }
.hero-mark.is-entered .hero-mark__pixel:nth-child(9) { transition-delay: 0.74s; }

.hero-mark.is-static .hero-mark__layer,
.hero-mark.is-static .hero-mark__pixel {
  opacity: 1 !important;
  transition: none !important;
  transform: none !important;
  will-change: auto;
}

@media (prefers-reduced-motion: reduce) {
  .hero-mark__layer,
  .hero-mark__pixel {
    opacity: 1 !important;
    transition: none !important;
    transform: none !important;
  }
}
</style>
