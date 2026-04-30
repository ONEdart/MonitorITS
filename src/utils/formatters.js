export function formatDate(date) {
  if (!date) return '—'
  const d = date?.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatTime(date) {
  if (!date) return '—'
  const d = date?.toDate ? date.toDate() : new Date(date)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(date) {
  if (!date) return '—'
  return `${formatDate(date)} ${formatTime(date)}`
}

export function formatRelative(date) {
  if (!date) return '—'
  const d = date?.toDate ? date.toDate() : new Date(date)
  const now = new Date()
  const diff = d - now
  const abs = Math.abs(diff)
  const days = Math.floor(abs / (1000 * 60 * 60 * 24))
  if (diff < 0) {
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days}d ago`
  }
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `in ${days}d`
}

export function toISODate(date) {
  if (!date) return ''
  const d = date?.toDate ? date.toDate() : new Date(date)
  return d.toISOString().split('T')[0]
}

export function fromISODate(str) {
  if (!str) return null
  return new Date(str + 'T00:00:00')
}