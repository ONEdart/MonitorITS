import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Dashboard' }
  },
  {
    path: '/staff',
    name: 'staff',
    component: () => import('@/views/StaffListView.vue'),
    meta: { title: 'Staff' }
  },
  {
    path: '/staff/:id',
    name: 'staff-detail',
    component: () => import('@/views/StaffDetailView.vue'),
    meta: { title: 'Staff Detail' }
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('@/views/TaskListView.vue'),
    meta: { title: 'Tasks' }
  },
  {
    path: '/logbook',
    name: 'logbook',
    component: () => import('@/views/LogbookView.vue'),
    meta: { title: 'Logbook' }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('@/views/CalendarPageView.vue'),
    meta: { title: 'Calendar' }
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/views/ReportsView.vue'),
    meta: { title: 'Reports' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { title: 'Settings' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router