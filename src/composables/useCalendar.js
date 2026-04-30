import { ref, computed } from 'vue'
import { calendarService } from '@/services/calendarService'
import { useToast } from './useToast'
import { toISODate } from '@/utils/formatters'

export function useCalendar() {
  const events = ref([])
  const loading = ref(false)
  const { success, error: toastError } = useToast()
  const currentMonth = ref(new Date().getMonth())
  const currentYear = ref(new Date().getFullYear())
  const viewMode = ref('month')

  async function fetchAll() {
    loading.value = true
    try {
      events.value = await calendarService.getAll()
    } catch (e) {
      toastError('Failed to load calendar events')
    } finally {
      loading.value = false
    }
  }

  async function fetchByRange(start, end) {
    loading.value = true
    try {
      events.value = await calendarService.getByDateRange(start, end)
    } catch (e) {
      toastError('Failed to load events')
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    const result = await calendarService.create(data)
    events.value.push(result)
    success('Event created')
    return result
  }

  async function update(id, data) {
    await calendarService.update(id, data)
    const idx = events.value.findIndex(e => e.id === id)
    if (idx >= 0) events.value[idx] = { ...events.value[idx], ...data }
    success('Event updated')
  }

  async function remove(id) {
    await calendarService.remove(id)
    events.value = events.value.filter(e => e.id !== id)
    success('Event removed')
  }

  function prevMonth() {
    if (currentMonth.value === 0) {
      currentMonth.value = 11
      currentYear.value--
    } else {
      currentMonth.value--
    }
  }

  function nextMonth() {
    if (currentMonth.value === 11) {
      currentMonth.value = 0
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }

  function goToToday() {
    const now = new Date()
    currentMonth.value = now.getMonth()
    currentYear.value = now.getFullYear()
  }

  const monthLabel = computed(() => {
    const d = new Date(currentYear.value, currentMonth.value, 1)
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  })

  const daysInMonth = computed(() => {
    const date = new Date(currentYear.value, currentMonth.value, 1)
    const days = []
    const startDay = date.getDay()
    const totalDays = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
    for (let i = 0; i < startDay; i++) days.push(null)
    for (let i = 1; i <= totalDays; i++) days.push(i)
    return days
  })

  function getEventsForDay(day) {
    if (!day) return []
    const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.value.filter(e => {
      const start = e.startDate?.toDate ? toISODate(e.startDate) : e.startDate
      return start === dateStr
    })
  }

  return {
    events, loading, currentMonth, currentYear, viewMode,
    fetchAll, fetchByRange, create, update, remove,
    prevMonth, nextMonth, goToToday, monthLabel, daysInMonth, getEventsForDay
  }
}