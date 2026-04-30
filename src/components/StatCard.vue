<template>
  <div class="stat-card" :class="[variantClass]">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">{{ formattedValue }}</div>
    <div v-if="subtitle" class="stat-subtitle">{{ subtitle }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: [Number, String],
  variant: { type: String, default: 'default' },
  subtitle: String,
  format: { type: String, default: 'number' }
})

const variantClass = computed(() => `stat-${props.variant}`)

const formattedValue = computed(() => {
  if (props.format === 'percent') return `${props.value}%`
  if (props.format === 'currency') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(props.value)
  }
  return props.value
})
</script>

<style scoped>
.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}
.stat-subtitle {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
.stat-success .stat-value { color: var(--color-success); }
.stat-warning .stat-value { color: var(--color-warning); }
.stat-danger .stat-value { color: var(--color-danger); }
.stat-info .stat-value { color: var(--color-info); }
</style>