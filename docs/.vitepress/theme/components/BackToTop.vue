<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="back-to-top">
    <button
      v-if="visible"
      class="back-to-top-btn"
      @click="scrollToTop"
      title="回到顶部"
      aria-label="回到顶部"
    >
      ↑
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top-btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-2);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 50;
  transition: transform 0.2s, opacity 0.2s;
}

.back-to-top-btn:hover {
  transform: scale(1.1);
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
