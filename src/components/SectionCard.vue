<template>
  <div class="section-card">
    <div class="section-header" v-if="$slots.header || title">
      <h3 class="section-title" v-if="title">{{ title }}</h3>
      <div class="section-actions" v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="section-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({ title: String })
</script>

<style scoped>
.section-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}
.section-title {
  font-size: 0.9375rem;
  font-weight: 600;
}
.section-actions {
  display: flex;
  gap: 8px;
}
.section-body {
  padding: 20px;
}
</style>