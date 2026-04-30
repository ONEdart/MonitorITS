<template>
  <div class="app-shell" :class="{ 'sidebar-collapsed': appState.sidebarCollapsed }">
    <Sidebar />
    <div class="app-main">
      <TopBar />
      <main class="app-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import TopBar from './TopBar.vue'
import { useAppState } from '@/composables/useAppState'
const { appState } = useAppState()
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
}
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: var(--sidebar-width);
  transition: margin-left var(--transition);
}
.app-shell.sidebar-collapsed .app-main {
  margin-left: 64px;
}
.app-content {
  flex: 1;
  padding: 24px 32px;
  max-width: 1440px;
  width: 100%;
}
@media (max-width: 900px) {
  .app-main {
    margin-left: 0;
  }
  .app-content {
    padding: 16px;
  }
}
</style>