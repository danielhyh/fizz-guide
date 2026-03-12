<script setup>
import { ref, computed, provide, nextTick } from 'vue'
import TreeNode from './TreeNode.vue'
import { MIDLANE_DATA } from '../data/midlane-data'

// --- State ---
const searchQuery = ref('')
const expandedIds = ref(new Set())

// 默认展开第一层
MIDLANE_DATA.children?.forEach(c => expandedIds.value.add(c.id))

// --- Helpers ---
function collectAllIds(node) {
  const ids = [node.id]
  node.children?.forEach(c => ids.push(...collectAllIds(c)))
  return ids
}

const allIds = collectAllIds(MIDLANE_DATA)

function toggleNode(id) {
  const s = new Set(expandedIds.value)
  s.has(id) ? s.delete(id) : s.add(id)
  expandedIds.value = s
}

function expandAll() {
  expandedIds.value = new Set(allIds)
}

function collapseAll() {
  expandedIds.value = new Set()
}

// --- Provide to TreeNode ---
provide('mindmap', {
  expandedIds,
  toggleNode,
  searchQuery,
})

// --- Search / Filter ---
function filterTree(node, q) {
  if (!q) return node
  const lower = q.toLowerCase()
  const labelMatch = node.label.toLowerCase().includes(lower)
  const detailMatch = node.details?.some(
    d => d.title.toLowerCase().includes(lower) || d.text.toLowerCase().includes(lower)
  )
  const filteredChildren = node.children?.map(c => filterTree(c, q)).filter(Boolean)

  if (labelMatch || detailMatch || (filteredChildren && filteredChildren.length > 0)) {
    return { ...node, children: filteredChildren || node.children }
  }
  return null
}

function collectFilteredIds(node) {
  if (!node) return []
  const ids = [node.id]
  node.children?.forEach(c => ids.push(...collectFilteredIds(c)))
  return ids
}

const filteredData = computed(() => {
  const q = searchQuery.value?.trim()
  if (!q) return MIDLANE_DATA

  const result = {
    ...MIDLANE_DATA,
    children: MIDLANE_DATA.children?.map(c => filterTree(c, q)).filter(Boolean) || [],
  }
  // 搜索时自动展开所有匹配节点
  nextTick(() => {
    expandedIds.value = new Set(collectFilteredIds(result))
  })
  return result
})

// --- Quick Nav ---
function scrollTo(id) {
  const el = document.getElementById(`section-${id}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  // 确保目标节点展开
  if (!expandedIds.value.has(id)) toggleNode(id)
}

// --- Section colors ---
const SECTION_COLORS = {
  '#e74c3c': 'rgba(231,76,60,',
  '#3498db': 'rgba(52,152,219,',
  '#e67e22': 'rgba(230,126,34,',
  '#9b59b6': 'rgba(155,89,182,',
  '#1abc9c': 'rgba(26,188,156,',
  '#f39c12': 'rgba(243,156,18,',
  '#2ecc71': 'rgba(46,204,113,',
}

function navBtnStyle(color) {
  const rgba = SECTION_COLORS[color] || 'rgba(52,152,219,'
  return {
    '--btn-color': color,
    '--btn-bg': rgba + '0.1)',
    '--btn-border': rgba + '0.3)',
    '--btn-hover-bg': rgba + '0.25)',
  }
}
</script>

<template>
  <div class="mindmap-wrapper">
    <!-- Controls -->
    <div class="controls">
      <div class="search-bar">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索关键词... 如: 游走、团战、出装、冻结"
          class="search-input"
        />
        <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">
          &times;
        </button>
      </div>
      <div class="action-btns">
        <button class="action-btn" @click="expandAll">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 5L7 10L12 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          全部展开
        </button>
        <button class="action-btn" @click="collapseAll">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 9L7 4L12 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          全部折叠
        </button>
      </div>
    </div>

    <!-- Quick Nav -->
    <div v-if="!searchQuery" class="quick-nav">
      <button
        v-for="child in MIDLANE_DATA.children"
        :key="child.id"
        class="nav-btn"
        :style="navBtnStyle(child.color)"
        @click="scrollTo(child.id)"
      >
        {{ child.icon }} {{ child.label }}
      </button>
    </div>

    <!-- Search result hint -->
    <div v-if="searchQuery && filteredData.children?.length" class="search-hint">
      找到 <strong>{{ filteredData.children.length }}</strong> 个匹配分类
    </div>

    <!-- Tree -->
    <div class="tree-container">
      <template v-if="filteredData.children?.length">
        <div v-for="child in filteredData.children" :key="child.id" :id="`section-${child.id}`">
          <TreeNode :node="child" :depth="0" :parent-color="child.color || '#3498db'" />
        </div>
      </template>
      <div v-else class="no-results">
        没有找到匹配的内容，试试其他关键词
      </div>
    </div>

    <!-- Footer Stats -->
    <div class="stats-bar">
      <div class="stat">
        <span class="stat-val" style="color:#3498db">7</span>
        <span class="stat-lbl">主题分类</span>
      </div>
      <div class="stat">
        <span class="stat-val" style="color:#e67e22">30+</span>
        <span class="stat-lbl">决策节点</span>
      </div>
      <div class="stat">
        <span class="stat-val" style="color:#2ecc71">150+</span>
        <span class="stat-lbl">策略要点</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mindmap-wrapper {
  margin-top: 16px;
}

/* --- Controls --- */
.controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.search-bar {
  position: relative;
  flex: 1;
  min-width: 220px;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-3);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 10px 36px 10px 36px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus {
  border-color: var(--vp-c-brand-1);
}
.search-input::placeholder {
  color: var(--vp-c-text-3);
}
.clear-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
}
.clear-btn:hover {
  color: var(--vp-c-text-1);
}

.action-btns {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.action-btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-alt);
}

/* --- Quick Nav --- */
.quick-nav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  padding: 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  border: 1px solid var(--vp-c-border);
}
.nav-btn {
  padding: 6px 14px;
  background: var(--btn-bg);
  border: 1px solid var(--btn-border);
  border-radius: 6px;
  color: var(--btn-color);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.nav-btn:hover {
  background: var(--btn-hover-bg);
}

/* --- Search hint --- */
.search-hint {
  padding: 8px 14px;
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
}

/* --- Tree --- */
.tree-container {
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
}
.no-results {
  text-align: center;
  padding: 48px 16px;
  color: var(--vp-c-text-3);
  font-size: 14px;
}

/* --- Stats --- */
.stats-bar {
  display: flex;
  justify-content: center;
  gap: 36px;
  margin-top: 16px;
  padding: 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  border: 1px solid var(--vp-c-border);
}
.stat {
  text-align: center;
}
.stat-val {
  display: block;
  font-size: 20px;
  font-weight: 700;
}
.stat-lbl {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 2px;
}
</style>
