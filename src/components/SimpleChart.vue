<template>
  <div class="simple-chart">
    <div class="chart-bars" v-if="type === 'bar'">
      <div v-for="(item, idx) in data" :key="idx" class="bar-item">
        <div class="bar-label">{{ item.label }}</div>
        <div class="bar-track">
          <div
            class="bar-fill"
            :style="{ width: barWidth(item.value) + '%', background: item.color || colors[idx % colors.length] }"
          ></div>
        </div>
        <div class="bar-value">{{ item.value }}{{ suffix }}</div>
      </div>
    </div>
    <div class="chart-horizontal" v-if="type === 'horizontal'">
      <div v-for="(item, idx) in data" :key="idx" class="h-bar-item">
        <span class="h-bar-label">{{ item.label }}</span>
        <div class="h-bar-track">
          <div
            class="h-bar-fill"
            :style="{ width: barWidth(item.value) + '%', background: item.color || colors[idx % colors.length] }"
          ></div>
        </div>
        <span class="h-bar-value">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'bar' },
  data: { type: Array, required: true },
  suffix: { type: String, default: '' }
})

const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const maxVal = computed(() => {
  if (!props.data.length) return 1
  return Math.max(...props.data.map(d => d.value), 1)
})

function barWidth(val) {
  return Math.round((val / maxVal.value) * 100)
}
</script>

<style scoped>
.simple-chart { display: flex; flex-direction: column; gap: 10px; }
.bar-item { display: flex; align-items: center; gap: 10px; }
.bar-label { width: 100px; font-size: 0.8125rem; font-weight: 500; text-align: right; flex-shrink: 0; }
.bar-track { flex: 1; height: 22px; background: var(--color-neutral-bg); border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s ease; display: flex; align-items: center; padding-left: 8px; color: #fff; font-size: 0.7rem; font-weight: 600; min-width: 0; }
.bar-value { width: 40px; font-size: 0.8125rem; font-weight: 600; text-align: left; flex-shrink: 0; }
.h-bar-item { display: flex; align-items: center; gap: 10px; padding: 6px 0; }
.h-bar-label { width: 100px; font-size: 0.8125rem; font-weight: 500; flex-shrink: 0; }
.h-bar-track { flex: 1; height: 8px; background: var(--color-neutral-bg); border-radius: 4px; overflow: hidden; }
.h-bar-fill { height: 100%; border-radius: 4px; }
.h-bar-value { width: 30px; font-size: 0.8125rem; font-weight: 600; }
</style>