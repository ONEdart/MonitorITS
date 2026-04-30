<template>
  <header class="topbar">
    <div class="topbar-left">
      <button class="btn btn-ghost menu-btn" @click="toggleSidebar" title="Toggle sidebar">
        &#x2630;
      </button>
      <h2 class="page-title">{{ pageTitle }}</h2>
      <span v-if="appState.currentStaffMode" class="staff-mode-indicator">
        <span class="separator">/</span>
        <span class="staff-name">{{ appState.currentStaffMode.name }}</span>
        <button class="btn btn-ghost btn-xs" @click="clearStaffMode">Clear</button>
      </span>
    </div>
    <div class="topbar-right">
      <button class="btn btn-primary btn-sm" @click="$emit('quick-task')">+ Task</button>
      <button class="btn btn-secondary btn-sm" @click="$emit('quick-staff')">+ Staff</button>
      <button class="btn btn-secondary btn-sm" @click="$emit('quick-log')">+ Log</button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppState } from '@/composables/useAppState'

const route = useRoute()
const { appState, toggleSidebar, clearStaffMode } = useAppState()

defineEmits(['quick-task', 'quick-staff', 'quick-log'])

const pageTitle = computed(() => route.meta?.title || 'MonitorITS')
</script>

<style scoped>
.topbar {
  height: var(--topbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
  gap: 16px;
}
.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.menu-btn {
  font-size: 1.25rem;
  padding: 4px 8px;
}
.page-title {
  font-size: 1.125rem;
  font-weight: 600;
  white-space: nowrap;
}
.staff-mode-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
.separator {
  color: var(--color-text-muted);
}
.staff-name {
  font-weight: 500;
  color: var(--color-accent);
}
.topbar-right {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
@media (max-width: 700px) {
  .topbar {
    padding: 0 12px;
  }
  .topbar-right .btn {
    padding: 6px 10px;
    font-size: 0.75rem;
  }
}
</style>