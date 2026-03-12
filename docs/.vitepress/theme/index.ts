import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Markmap from './components/Markmap.vue'
import MidlaneMindmap from './components/MidlaneMindmap.vue'
import BackToTop from './components/BackToTop.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(BackToTop),
    })
  },
  enhanceApp({ app }) {
    app.component('Markmap', Markmap)
    app.component('MidlaneMindmap', MidlaneMindmap)
  },
}
