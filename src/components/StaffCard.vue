<template>
  <div class="staff-card" @click="$emit('click', staff)">
    <div class="staff-avatar" :style="{ background: staff.color || '#64748b' }">
      {{ initials }}
    </div>
    <div class="staff-info">
      <div class="staff-name">{{ staff.name }}</div>
      <div class="staff-role">{{ staff.role || 'No role' }}</div>
    </div>
    <div class="staff-meta">
      <span v-if="staff.active === false" class="badge" style="background:#fee2e2;color:#991b1b;">Inactive</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ staff: Object })
defineEmits(['click'])
const initials = computed(() => {
  const name = props.staff.name || '?'
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
})
</script>

<style scoped>
.staff-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all var(--transition);
}
.staff-card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}
.staff-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}
.staff-info {
  flex: 1;
  min-width: 0;
}
.staff-name {
  font-weight: 600;
  font-size: 0.9375rem;
}
.staff-role {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}
.staff-meta {
  flex-shrink: 0;
}
</style>