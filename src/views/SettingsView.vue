<template>
  <div class="settings-page">
    <h1>Settings</h1>

    <SectionCard title="Application">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">App Title</label>
          <input class="form-input" v-model="form.appTitle" />
        </div>
      </div>
      <button class="btn btn-primary" style="margin-top:16px" @click="saveSettings" :disabled="saving">
        {{ saving ? 'Saving...' : 'Save Settings' }}
      </button>
    </SectionCard>

    <SectionCard title="About" style="margin-top:16px">
      <p class="about-text">MonitorITS — Internal Staff Task Monitoring & Daily Logbook System.</p>
      <p class="about-version">Version 1.0.0</p>
    </SectionCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SectionCard from '@/components/SectionCard.vue'
import { useAppState } from '@/composables/useAppState'
import { useToast } from '@/composables/useToast'

const { appState, saveSettings: persistSettings } = useAppState()
const { success, error: toastError } = useToast()

const form = ref({ appTitle: 'MonitorITS' })
const saving = ref(false)

onMounted(() => {
  form.value.appTitle = appState.settings?.appTitle || 'MonitorITS'
})

async function saveSettings() {
  saving.value = true
  try {
    await persistSettings(form.value)
    success('Settings saved')
  } catch {
    toastError('Failed to save settings')
  } finally { saving.value = false }
}
</script>

<style scoped>
.settings-page { display: flex; flex-direction: column; gap: 16px; max-width: 600px; }
.form-grid { display: flex; flex-direction: column; gap: 14px; }
.about-text { font-size: 0.875rem; color: var(--color-text-secondary); }
.about-version { font-size: 0.75rem; color: var(--color-text-muted); margin-top: 4px; }
</style>