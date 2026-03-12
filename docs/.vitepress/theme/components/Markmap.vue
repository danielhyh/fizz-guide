<template>
  <ClientOnly>
    <div class="markmap-container">
      <div ref="toolbarRef" class="markmap-toolbar-wrap"></div>
      <svg ref="svgRef" class="markmap-svg"></svg>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  content: { type: String, required: true },
  height: { type: String, default: '750px' },
})

const svgRef = ref(null)
const toolbarRef = ref(null)
let mm = null

onMounted(async () => {
  await nextTick()
  if (!svgRef.value) return

  const { Transformer } = await import('markmap-lib')
  const { Markmap, deriveOptions } = await import('markmap-view')
  const { Toolbar } = await import('markmap-toolbar')

  const transformer = new Transformer()
  const { root, features } = transformer.transform(props.content)
  const options = deriveOptions(features)

  svgRef.value.style.height = props.height
  mm = Markmap.create(svgRef.value, { ...options, fitRatio: 0.85 }, root)

  // toolbar
  if (toolbarRef.value) {
    const toolbar = Toolbar.create(mm)
    toolbarRef.value.appendChild(toolbar.el)
  }
})

onUnmounted(() => {
  if (mm) {
    mm.destroy()
    mm = null
  }
})
</script>

<style scoped>
.markmap-container {
  position: relative;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.markmap-svg {
  width: 100%;
  display: block;
}

.markmap-toolbar-wrap {
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 10;
}
</style>

<style>
/* markmap-toolbar 全局样式覆盖 */
.markmap-toolbar {
  background: var(--vp-c-bg-soft) !important;
  border: 1px solid var(--vp-c-border) !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
}
.markmap-toolbar button {
  color: var(--vp-c-text-1) !important;
}
</style>
