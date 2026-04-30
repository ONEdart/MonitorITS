<template>
  <span class="badge status-badge" :style="badgeStyle">{{ status }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { getStatusBadgeStyle } from '@/utils/status'

const props = defineProps({ status: String })
const badgeStyle = computed(() => {
  const s = getStatusBadgeStyle(props.status)
  return { background: s.bg, color: s.text }
})
</script>

<style scoped>
.status-badge {
  font-weight: 500;
}
</style>