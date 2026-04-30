<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('cancel')">
      <div class="confirm-dialog">
        <h4 class="confirm-title">{{ title }}</h4>
        <p class="confirm-message" v-if="message">{{ message }}</p>
        <div class="confirm-actions">
          <button class="btn btn-secondary" @click="$emit('cancel')">Cancel</button>
          <button class="btn btn-danger" @click="$emit('confirm')">{{ confirmLabel }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Confirm' },
  message: String,
  confirmLabel: { type: String, default: 'Delete' }
})
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  z-index: 250;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.confirm-dialog {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 24px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}
.confirm-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.confirm-message {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 20px;
}
.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>