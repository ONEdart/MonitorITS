<template>
  <div class="progress-bar-container">
    <div class="progress-bar-track">
      <div
        class="progress-bar-fill"
        :class="colorClass"
        :style="{ width: clampedValue + '%' }"
      ></div>
    </div>
    <span class="progress-bar-label" v-if="showLabel">{{ clampedValue }}%</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
  showLabel: { type: Boolean, default: true }
})

const clampedValue = computed(() => Math.min(100, Math.max(0, Math.round(props.value || 0))))

const colorClass = computed(() => {
  if (clampedValue.value >= 100) return 'fill-done'
  if (clampedValue.value >= 70) return 'fill-high'
  if (clampedValue.value >= 30) return 'fill-mid'
  return 'fill-low'
})
</script>

<style scoped>
.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 80px;
}
.progress-bar-track {
  flex: 1;
  height: 6px;
  background: var(--color-neutral-bg);
  border-radius: 3px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}
.fill-low { background: var(--color-text-muted); }
.fill-mid { background: #3b82f6; }
.fill-high { background: #22c55e; }
.fill-done { background: #15803d; }
.progress-bar-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 32px;
  text-align: right;
}
</style>