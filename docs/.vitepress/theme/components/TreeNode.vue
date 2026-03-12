<script setup>
import { computed, inject } from 'vue'

defineOptions({ name: 'TreeNode' })

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 },
  parentColor: { type: String, default: '#3498db' },
})

const { expandedIds, toggleNode, searchQuery } = inject('mindmap')

const color = computed(() => props.node.color || props.parentColor)
const isOpen = computed(() => expandedIds.value.has(props.node.id))
const hasChildren = computed(() =>
  (props.node.children?.length > 0) || (props.node.details?.length > 0)
)

function highlightText(text) {
  const q = searchQuery.value
  if (!q) return text
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="mm-highlight">$1</mark>')
}
</script>

<template>
  <div class="tree-node" :class="`depth-${depth}`">
    <!-- Node header -->
    <div
      class="node-header"
      :class="{ 'is-open': isOpen, 'is-root': depth === 0, clickable: hasChildren }"
      :style="{
        '--node-color': color,
        '--node-bg': color + '12',
        '--node-border': color + '40',
      }"
      @click="hasChildren && toggleNode(node.id)"
    >
      <span v-if="hasChildren" class="toggle-icon" :class="{ open: isOpen }">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M4 2 L8 6 L4 10" fill="none" :stroke="color" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span v-else class="toggle-spacer" />
      <span class="node-icon">{{ node.icon }}</span>
      <span class="node-label" v-html="highlightText(node.label)" />
    </div>

    <!-- Expanded content -->
    <div v-if="isOpen" class="node-content" :style="{ '--node-border': color + '30' }">
      <!-- Details -->
      <div
        v-for="(detail, i) in node.details"
        :key="'d' + i"
        class="detail-card"
        :style="{ '--node-color': color, '--node-bg': color + '10', '--node-border': color + '35' }"
      >
        <span class="detail-title" v-html="highlightText(detail.title)" />
        <span class="detail-text" v-html="highlightText(detail.text)" />
      </div>

      <!-- Children -->
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :parent-color="color"
      />
    </div>
  </div>
</template>

<style scoped>
.tree-node {
  margin-left: 0;
}
.depth-1, .depth-2, .depth-3, .depth-4 {
  margin-left: 16px;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 2px;
  border: 1px solid transparent;
  transition: all 0.15s ease;
  user-select: none;
}
.node-header.clickable {
  cursor: pointer;
}
.node-header.clickable:hover {
  background: var(--node-bg);
  border-color: var(--node-border);
}
.node-header.is-root {
  padding: 12px 16px;
}
.node-header.is-root.is-open {
  background: var(--node-bg);
  border-color: var(--node-border);
}

.toggle-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
.toggle-icon.open {
  transform: rotate(90deg);
}
.toggle-spacer {
  width: 18px;
  flex-shrink: 0;
}

.node-icon {
  font-size: 16px;
  flex-shrink: 0;
}
.depth-0 > .node-header .node-icon {
  font-size: 20px;
}

.node-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}
.depth-0 > .node-header .node-label {
  font-size: 16px;
  font-weight: 700;
  color: var(--node-color);
}
.depth-1 > .node-header .node-label {
  font-weight: 600;
}

.node-content {
  margin-left: 24px;
  padding-left: 14px;
  border-left: 2px solid var(--node-border);
  margin-top: 2px;
  margin-bottom: 6px;
}

.detail-card {
  padding: 8px 12px;
  margin-bottom: 4px;
  background: var(--node-bg);
  border-left: 3px solid var(--node-border);
  border-radius: 0 6px 6px 0;
  line-height: 1.6;
}
.detail-title {
  font-weight: 600;
  font-size: 13px;
  color: var(--node-color);
  margin-right: 8px;
}
.detail-text {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>

<style>
.mm-highlight {
  background: rgba(255, 213, 0, 0.35);
  color: inherit;
  padding: 1px 2px;
  border-radius: 2px;
}
</style>
