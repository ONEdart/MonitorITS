<template>
  <div class="empty-state">
    <div class="empty-icon">&#x25A1;</div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-description" v-if="description">{{ description }}</p>
    <button v-if="actionLabel" class="btn btn-primary" @click="$emit('action')">
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Nothing here yet' },
  description: String,
  actionLabel: String
})
defineEmits(['action'])
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  gap: 8px;
}
.empty-icon {
  font-size: 2.5rem;
  color: var(--color-text-muted);
  margin-bottom: 8px;
  opacity: 0.5;
}
.empty-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}
.empty-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  max-width: 320px;
}
</style>