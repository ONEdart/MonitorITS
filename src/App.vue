<template>
  <AppShell>
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </AppShell>
  <Toast />
</template>

<script setup>
import AppShell from '@/components/AppShell.vue'
import Toast from '@/components/Toast.vue'
import { useAppState } from '@/composables/useAppState'

const { loadSettings } = useAppState()
loadSettings()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>