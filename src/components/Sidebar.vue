<template>
  <aside class="sidebar" :class="{ collapsed: appState.sidebarCollapsed }">
    <div class="sidebar-header">
      <div class="sidebar-logo" v-if="!appState.sidebarCollapsed">
        <div class="logo-icon">M</div>
        <span class="logo-text">{{ appState.settings.appTitle || 'MonitorITS' }}</span>
      </div>
      <div class="sidebar-logo logo-compact" v-else>
        <div class="logo-icon">M</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        :title="appState.sidebarCollapsed ? item.label : ''"
      >
        <span class="nav-icon" v-html="item.icon"></span>
        <span class="nav-label" v-if="!appState.sidebarCollapsed">{{ item.label }}</span>
      </router-link>
    </nav>
    <div class="sidebar-footer" v-if="!appState.sidebarCollapsed">
      <div class="sidebar-version">v1.0.0</div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAppState } from '@/composables/useAppState'

const route = useRoute()
const { appState } = useAppState()

const navItems = [
  { path: '/', label: 'Dashboard', icon: '&#x25A3;' },
  { path: '/staff', label: 'Staff', icon: '&#x25CB;' },
  { path: '/tasks', label: 'Tasks', icon: '&#x25A7;' },
  { path: '/logbook', label: 'Logbook', icon: '&#x25A6;' },
  { path: '/calendar', label: 'Calendar', icon: '&#x25A8;' },
  { path: '/reports', label: 'Reports', icon: '&#x25A9;' },
  { path: '/settings', label: 'Settings', icon: '&#x2699;' }
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--color-sidebar);
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width var(--transition);
  overflow: hidden;
}
.sidebar.collapsed {
  width: 64px;
}
.sidebar-header {
  padding: 16px;
  display: flex;
  align-items: center;
  height: var(--topbar-height);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-icon {
  width: 32px;
  height: 32px;
  background: #3b82f6;
  color: #fff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}
.logo-text {
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
}
.logo-compact {
  justify-content: center;
  width: 100%;
}
.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius);
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all var(--transition);
  white-space: nowrap;
}
.nav-item:hover {
  background: var(--color-sidebar-hover);
  color: #f1f5f9;
  text-decoration: none;
}
.nav-item.active {
  background: var(--color-sidebar-active);
  color: #fff;
}
.nav-icon {
  font-size: 1.125rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}
.nav-label {
  transition: opacity 0.1s;
}
.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.sidebar-version {
  font-size: 0.6875rem;
  color: #64748b;
}
.collapsed .nav-item {
  justify-content: center;
  padding: 10px;
}
@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.collapsed {
    transform: translateX(0);
    width: var(--sidebar-width);
  }
}
</style>