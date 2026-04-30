import {
  db, doc, getDoc, setDoc
} from '@/firebase'

const DOC_ID = 'app_settings'

export const settingsService = {
  async get() {
    const d = await getDoc(doc(db, 'settings', DOC_ID))
    if (d.exists()) return { id: d.id, ...d.data() }
    return {
      id: DOC_ID,
      theme: 'light',
      displayPrefs: {},
      defaultFilters: { period: 'month' },
      appTitle: 'MonitorITS'
    }
  },

  async save(data) {
    await setDoc(doc(db, 'settings', DOC_ID), data, { merge: true })
    return { id: DOC_ID, ...data }
  }
}