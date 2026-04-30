import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/global.css'

// Global error handler
const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('Global Vue Error:', err)
  console.error('Component:', instance)
  console.error('Info:', info)
}

app.config.warnHandler = (msg, instance, trace) => {
  console.warn('Vue Warning:', msg, trace)
}

// Toast disediakan langsung tanpa import bermasalah
app.provide('toast', {
  toasts: [],
  add() {},
  remove() {},
  success(msg) { console.log('Success:', msg) },
  error(msg) { console.error('Error:', msg) },
  warning(msg) { console.warn('Warning:', msg) },
  info(msg) { console.info('Info:', msg) }
})

app.use(router)

try {
  app.mount('#app')
  console.log('MonitorITS mounted successfully')
} catch (e) {
  console.error('Mount failed:', e)
  document.getElementById('app').innerHTML = 
    '<div style="padding:40px;font-family:sans-serif;">' +
    '<h2>MonitorITS Error</h2>' +
    '<p>Failed to start application.</p>' +
    '<pre style="background:#fee;padding:10px;overflow:auto;">' + e.message + '</pre>' +
    '<p>Check browser console (F12) for details.</p>' +
    '</div>'
}