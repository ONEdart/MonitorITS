import { reactive, readonly } from 'vue'

const state = reactive({
  toasts: [],
  idCounter: 0
})

export function useToast() {
  function add(message, type = 'info', duration = 4000) {
    const id = ++state.idCounter
    state.toasts.push({ id, message, type })
    setTimeout(() => remove(id), duration)
  }

  function remove(id) {
    state.toasts = state.toasts.filter(t => t.id !== id)
  }

  function success(msg) { add(msg, 'success') }
  function error(msg) { add(msg, 'error') }
  function warning(msg) { add(msg, 'warning') }
  function info(msg) { add(msg, 'info') }

  return { toasts: readonly(state.toasts), add, remove, success, error, warning, info }
}

export function provideToast(app) {
  const toast = useToast()
  app.provide('toast', toast)
  app.config.globalProperties.$toast = toast
}