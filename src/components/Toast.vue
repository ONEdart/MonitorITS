<template>
  <div class="toast-container">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast"
      :class="'toast-' + t.type"
      @click="remove(t.id)"
    >
      {{ t.message }}
    </div>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
const { toasts, remove } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.toast {
  padding: 12px 20px;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  animation: slideIn 0.2s ease;
  max-width: 360px;
}
.toast-success { background: #15803d; color: #fff; }
.toast-error { background: #b91c1c; color: #fff; }
.toast-warning { background: #b45309; color: #fff; }
.toast-info { background: #1e40af; color: #fff; }
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>