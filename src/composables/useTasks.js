import { ref, computed } from 'vue'
import { taskService } from '@/services/taskService'
import { useToast } from './useToast'
import { getEffectiveStatus, isOverdue } from '@/utils/status'

export function useTasks() {
  const taskList = ref([])
  const currentTask = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const { success, error: toastError } = useToast()

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      taskList.value = await taskService.getAll()
    } catch (e) {
      error.value = e.message
      toastError('Failed to load tasks')
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    loading.value = true
    try {
      currentTask.value = await taskService.getById(id)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchByStaff(staffId) {
    loading.value = true
    try {
      taskList.value = await taskService.getByStaff(staffId)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    const result = await taskService.create(data)
    taskList.value.unshift(result)
    success('Task created')
    return result
  }

  async function update(id, data) {
    await taskService.update(id, data)
    const idx = taskList.value.findIndex(t => t.id === id)
    if (idx >= 0) taskList.value[idx] = { ...taskList.value[idx], ...data }
    if (currentTask.value?.id === id) {
      currentTask.value = { ...currentTask.value, ...data }
    }
    success('Task updated')
  }

  async function updateStatus(id, status, progressPercent) {
    const payload = { status }
    if (status === 'Done') payload.progressPercent = 100
    else if (progressPercent !== undefined) payload.progressPercent = progressPercent
    await update(id, payload)
  }

  async function remove(id) {
    await taskService.remove(id)
    taskList.value = taskList.value.filter(t => t.id !== id)
    success('Task removed')
  }

  const tasksWithEffectiveStatus = computed(() =>
    taskList.value.map(t => ({ ...t, effectiveStatus: getEffectiveStatus(t) }))
  )

  const overdueTasks = computed(() =>
    tasksWithEffectiveStatus.value.filter(t => t.effectiveStatus === 'Overdue')
  )

  const urgentTasks = computed(() =>
    taskList.value.filter(t => t.priority === 'Critical' || t.priority === 'High').filter(t => t.status !== 'Done')
  )

  return {
    taskList, currentTask, loading, error,
    fetchAll, fetchById, fetchByStaff, create, update, updateStatus, remove,
    tasksWithEffectiveStatus, overdueTasks, urgentTasks
  }
}