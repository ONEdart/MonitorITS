<template>
  <div class="task-card" :class="{ 'task-overdue': effectiveStatus === 'Overdue' }">
    <div class="task-top">
      <StatusBadge :status="effectiveStatus" />
      <span class="badge" :style="priorityStyle">{{ task.priority || 'Medium' }}</span>
    </div>
    <h4 class="task-title">{{ task.title }}</h4>
    <p class="task-desc" v-if="task.description">{{ truncatedDesc }}</p>
    <div class="task-meta">
      <span v-if="task.assignedStaffName" class="task-staff">{{ task.assignedStaffName }}</span>
      <span class="task-date">Due {{ formatDate(task.dueDate) }}</span>
    </div>
    <ProgressBar :value="task.progressPercent || 0" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'
import ProgressBar from './ProgressBar.vue'
import { getEffectiveStatus } from '@/utils/status'
import { formatDate } from '@/utils/formatters'
import { PRIORITY_COLORS } from '@/utils/status'

const props = defineProps({ task: Object })

const effectiveStatus = computed(() => getEffectiveStatus(props.task))
const truncatedDesc = computed(() => {
  const d = props.task.description || ''
  return d.length > 80 ? d.substring(0, 80) + '...' : d
})
const priorityStyle = computed(() => {
  const c = PRIORITY_COLORS[props.task.priority] || PRIORITY_COLORS['Medium']
  return { background: c.bg, color: c.text }
})
</script>

<style scoped>
.task-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all var(--transition);
}
.task-card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}
.task-overdue {
  border-left: 3px solid #ef4444;
}
.task-top {
  display: flex;
  gap: 6px;
  align-items: center;
}
.task-title {
  font-size: 0.9375rem;
  font-weight: 600;
}
.task-desc {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}
.task-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
.task-staff {
  font-weight: 500;
  color: var(--color-accent);
}
</style>