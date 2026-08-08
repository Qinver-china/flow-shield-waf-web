import DefaultTheme from 'vitepress/theme'
import { h, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import type { Zoom } from 'medium-zoom'
import HomeHero from './components/HomeHero.vue'
import HomeShowcase from './components/HomeShowcase.vue'
import HomeFeatureCards from './components/HomeFeatureCards.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-before': () => h(HomeHero),
      'home-hero-after': () => [ h(HomeFeatureCards),h(HomeShowcase)]
    })
  },
  setup() {
    const route = useRoute()
    let zoom: Zoom | undefined

    const initZoom = () => {
      zoom?.detach()
      zoom = mediumZoom('.vp-doc :not(a) > img:not(.no-zoom)', {
        background: '#00000073',
        margin: 16
      })
    }

    onMounted(() => {
      initZoom()
    })

    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }
}
