import { ref, computed } from 'vue'
import { staffService } from '@/services/staffService'
import { useToast } from './useToast'

export function useStaff() {
  const staffList = ref([])
  const currentStaff = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const { success, error: toastError } = useToast()

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      staffList.value = await staffService.getAll()
    } catch (e) {
      error.value = e.message
      toastError('Failed to load staff')
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    loading.value = true
    try {
      currentStaff.value = await staffService.getById(id)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    const result = await staffService.create(data)
    staffList.value.unshift(result)
    success('Staff created')
    return result
  }

  async function update(id, data) {
    await staffService.update(id, data)
    const idx = staffList.value.findIndex(s => s.id === id)
    if (idx >= 0) staffList.value[idx] = { ...staffList.value[idx], ...data }
    if (currentStaff.value?.id === id) {
      currentStaff.value = { ...currentStaff.value, ...data }
    }
    success('Staff updated')
  }

  async function remove(id) {
    await staffService.remove(id)
    staffList.value = staffList.value.filter(s => s.id !== id)
    success('Staff removed')
  }

  const activeStaff = computed(() => staffList.value.filter(s => s.active !== false))

  return { staffList, currentStaff, loading, error, fetchAll, fetchById, create, update, remove, activeStaff }
}