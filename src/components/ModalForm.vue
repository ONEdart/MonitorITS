<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container" :style="{ maxWidth: maxWidth }">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="btn btn-ghost modal-close" @click="$emit('close')">&times;</button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  title: String,
  maxWidth: { type: String, default: '520px' }
})
defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.modal-container {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}
.modal-title {
  font-size: 1.0625rem;
  font-weight: 600;
}
.modal-close {
  font-size: 1.5rem;
  padding: 0 4px;
  line-height: 1;
}
.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}
.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>