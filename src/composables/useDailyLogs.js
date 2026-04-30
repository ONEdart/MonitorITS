import { ref } from 'vue'
import { dailyLogService } from '@/services/dailyLogService'
import { useToast } from './useToast'

export function useDailyLogs() {
  const logList = ref([])
  const loading = ref(false)
  const error = ref(null)
  const { success, error: toastError } = useToast()

  async function fetchAll() {
    loading.value = true
    try {
      logList.value = await dailyLogService.getAll()
    } catch (e) {
      error.value = e.message
      toastError('Failed to load logs')
    } finally {
      loading.value = false
    }
  }

  async function fetchByStaff(staffId) {
    loading.value = true
    try {
      logList.value = await dailyLogService.getByStaff(staffId)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    const result = await dailyLogService.create(data)
    logList.value.unshift(result)
    success('Log entry created')
    return result
  }

  async function update(id, data) {
    await dailyLogService.update(id, data)
    const idx = logList.value.findIndex(l => l.id === id)
    if (idx >= 0) logList.value[idx] = { ...logList.value[idx], ...data }
    success('Log updated')
  }

  async function remove(id) {
    await dailyLogService.remove(id)
    logList.value = logList.value.filter(l => l.id !== id)
    success('Log removed')
  }

  return { logList, loading, error, fetchAll, fetchByStaff, create, update, remove }
}