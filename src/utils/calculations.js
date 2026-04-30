import { getEffectiveStatus } from './status'

export function calculateStaffProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0
  const total = tasks.reduce((sum, t) => sum + (t.progressPercent || 0), 0)
  return Math.round(total / tasks.length)
}

export function getTaskCompletionRate(tasks) {
  if (!tasks || tasks.length === 0) return 0
  const done = tasks.filter(t => t.status === 'Done').length
  return Math.round((done / tasks.length) * 100)
}

export function getOverdueCount(tasks) {
  if (!tasks) return 0
  return tasks.filter(t => getEffectiveStatus(t) === 'Overdue').length
}

export function getActiveTaskCount(tasks) {
  if (!tasks) return 0
  return tasks.filter(t => t.status !== 'Done').length
}

export function groupByStaff(tasks) {
  const groups = {}
  for (const t of tasks) {
    const key = t.assignedStaffId || 'unassigned'
    if (!groups[key]) groups[key] = { staffId: key, staffName: t.assignedStaffName || 'Unassigned', tasks: [] }
    groups[key].tasks.push(t)
  }
  return Object.values(groups)
}

export function groupByStatus(tasks) {
  const groups = { 'To Do': 0, 'In Progress': 0, 'Review': 0, 'Done': 0, 'Overdue': 0 }
  for (const t of tasks) {
    const status = getEffectiveStatus(t)
    groups[status] = (groups[status] || 0) + 1
  }
  return groups
}

export function filterByDateRange(items, start, end, field = 'createdAt') {
  if (!items) return []
  const s = start ? new Date(start) : null
  const e = end ? new Date(end) : null
  return items.filter(item => {
    const d = item[field]?.toDate ? item[field].toDate() : new Date(item[field])
    if (s && d < s) return false
    if (e) {
      e.setHours(23, 59, 59, 999)
      if (d > e) return false
    }
    return true
  })
}

export function getTeamAverageProgress(staffProgressMap) {
  const values = Object.values(staffProgressMap)
  if (values.length === 0) return 0
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}