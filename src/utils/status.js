export const TASK_STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  DONE: 'Done',
  OVERDUE: 'Overdue'
}

export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
}

export const STATUS_COLORS = {
  'To Do': { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' },
  'In Progress': { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
  'Review': { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  'Done': { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
  'Overdue': { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' }
}

export const PRIORITY_COLORS = {
  'Low': { bg: '#f1f5f9', text: '#475569' },
  'Medium': { bg: '#dbeafe', text: '#1e40af' },
  'High': { bg: '#fef3c7', text: '#92400e' },
  'Critical': { bg: '#fee2e2', text: '#991b1b' }
}

export function getStatusBadgeStyle(status) {
  return STATUS_COLORS[status] || STATUS_COLORS['To Do']
}

export function isOverdue(dueDate, status) {
  if (!dueDate || status === 'Done') return false
  const d = dueDate?.toDate ? dueDate.toDate() : new Date(dueDate)
  return d < new Date()
}

export function getEffectiveStatus(task) {
  if (task.status === 'Done') return 'Done'
  if (isOverdue(task.dueDate, task.status)) return 'Overdue'
  return task.status || 'To Do'
}