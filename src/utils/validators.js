export function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`
  }
  return null
}

export function validateProgress(value) {
  const n = Number(value)
  if (isNaN(n) || n < 0 || n > 100) {
    return 'Progress must be between 0 and 100'
  }
  return null
}

export function validateDate(value, fieldName) {
  if (!value) return `${fieldName} is required`
  const d = new Date(value)
  if (isNaN(d.getTime())) return `${fieldName} is not a valid date`
  return null
}

export function validateTaskForm(data) {
  const errors = {}
  const titleErr = validateRequired(data.title, 'Title')
  if (titleErr) errors.title = titleErr
  if (data.dueDate) {
    const dateErr = validateDate(data.dueDate, 'Due date')
    if (dateErr) errors.dueDate = dateErr
  }
  if (data.progressPercent !== undefined && data.progressPercent !== '') {
    const progErr = validateProgress(data.progressPercent)
    if (progErr) errors.progressPercent = progErr
  }
  return errors
}

export function validateStaffForm(data) {
  const errors = {}
  const nameErr = validateRequired(data.name, 'Name')
  if (nameErr) errors.name = nameErr
  return errors
}

export function validateLogForm(data) {
  const errors = {}
  const dateErr = validateRequired(data.date, 'Date')
  if (dateErr) errors.date = dateErr
  if (!data.staffId) errors.staffId = 'Staff is required'
  return errors
}