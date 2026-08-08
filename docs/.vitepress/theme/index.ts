import DefaultTheme from 'vitepress/theme'
import { nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import type { Zoom } from 'medium-zoom'
import './custom.css'

export default {
  extends: DefaultTheme,
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
