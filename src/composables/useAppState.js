import { reactive, readonly } from 'vue'
import { settingsService } from '@/services/settingsService'

const state = reactive({
  sidebarCollapsed: false,
  currentStaffMode: null,
  globalFilters: { period: 'month', startDate: null, endDate: null },
  settings: { theme: 'light', appTitle: 'MonitorITS', displayPrefs: {}, defaultFilters: {} },
  loading: false
})

export function useAppState() {
  function toggleSidebar() {
    state.sidebarCollapsed = !state.sidebarCollapsed
  }

  function setStaffMode(staff) {
    state.currentStaffMode = staff
  }

  function clearStaffMode() {
    state.currentStaffMode = null
  }

  function setGlobalFilters(filters) {
    Object.assign(state.globalFilters, filters)
  }

  async function loadSettings() {
    try {
      state.loading = true
      state.settings = await settingsService.get()
    } catch (e) {
      console.error('Failed to load settings:', e)
    } finally {
      state.loading = false
    }
  }

  async function saveSettings(data) {
    try {
      state.settings = await settingsService.save(data)
    } catch (e) {
      throw e
    }
  }

  return {
    appState: readonly(state),
    toggleSidebar,
    setStaffMode,
    clearStaffMode,
    setGlobalFilters,
    loadSettings,
    saveSettings
  }
}