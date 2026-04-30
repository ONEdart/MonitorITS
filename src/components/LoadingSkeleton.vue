<template>
  <div class="skeleton-container">
    <div v-for="i in count" :key="i" class="skeleton-row">
      <div class="skeleton-block" :style="{ width: randomWidth() }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({ count: { type: Number, default: 5 } })
function randomWidth() {
  return (60 + Math.random() * 40) + '%'
}
</script>

<style scoped>
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 0;
}
.skeleton-row {
  display: flex;
}
.skeleton-block {
  height: 14px;
  background: #e2e8f0;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>