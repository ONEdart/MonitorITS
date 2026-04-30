<template>
  <div class="reports-page">
    <div class="page-header">
      <h1>Reports & Analytics</h1>
      <select class="form-select" v-model="period" style="width:140px">
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="all">All Time</option>
      </select>
    </div>

    <LoadingSkeleton v-if="loading" :count="4" />

    <template v-else>
      <div class="stats-grid">
        <StatCard label="Completion Rate" :value="completionRate" format="percent" variant="success" />
        <StatCard label="Overdue Rate" :value="overdueRate" format="percent" variant="danger" />
        <StatCard label="Avg Team Progress" :value="teamAvgProgress" format="percent" variant="info" />
      </div>

      <div class="reports-grid">
        <SectionCard title="Progress by Staff">
          <SimpleChart type="bar" :data="staffProgressData" suffix="%" />
        </SectionCard>

        <SectionCard title="Tasks by Status">
          <SimpleChart type="horizontal" :data="statusData" />
        </SectionCard>

        <SectionCard title="Tasks by Priority">
          <SimpleChart type="horizontal" :data="priorityData" />
        </SectionCard>

        <SectionCard title="Most Active Staff">
          <SimpleChart type="bar" :data="activeStaffData" suffix=" tasks" />
        </SectionCard>
      </div>

      <SectionCard title="Overdue Tasks">
        <div v-if="overdueList.length" class="overdue-list">
          <div v-for="t in overdueList" :key="t.id" class="overdue-row">
            <StatusBadge status="Overdue" />
            <span>{{ t.title }}</span>
            <span>{{ t.assignedStaffName || '—' }}</span>
            <span>{{ formatDate(t.dueDate) }}</span>
          </div>
        </div>
        <EmptyState v-else title="No overdue tasks" description="Everything is on track." />
      </SectionCard>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from '@/components/StatCard.vue'
import SectionCard from '@/components/SectionCard.vue'
import SimpleChart from '@/components/SimpleChart.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useTasks } from '@/composables/useTasks'
import { useStaff } from '@/composables/useStaff'
import { getEffectiveStatus } from '@/utils/status'
import { groupByStatus, calculateStaffProgress, getTaskCompletionRate, getOverdueCount } from '@/utils/calculations'
import { formatDate } from '@/utils/formatters'

const { taskList, tasksWithEffectiveStatus, fetchAll: fetchTasks } = useTasks()
const { staffList, fetchAll: fetchStaff } = useStaff()
const loading = ref(true)
const period = ref('month')

onMounted(async () => {
  await Promise.all([fetchTasks(), fetchStaff()])
  loading.value = false
})

const completionRate = computed(() => getTaskCompletionRate(taskList.value))
const overdueRate = computed(() => {
  if (!taskList.value.length) return 0
  return Math.round((getOverdueCount(taskList.value) / taskList.value.length) * 100)
})
const teamAvgProgress = computed(() => {
  if (!taskList.value.length) return 0
  return Math.round(taskList.value.reduce((s, t) => s + (t.progressPercent || 0), 0) / taskList.value.length)
})

const statusData = computed(() => {
  const g = groupByStatus(taskList.value)
  return Object.entries(g).map(([k, v]) => ({ label: k, value: v }))
})

const priorityData = computed(() => {
  const map = {}
  for (const t of taskList.value) {
    const p = t.priority || 'Medium'
    map[p] = (map[p] || 0) + 1
  }
  return Object.entries(map).map(([k, v]) => ({ label: k, value: v }))
})

const staffProgressData = computed(() => {
  const map = {}
  for (const t of taskList.value) {
    const key = t.assignedStaffId || 'unassigned'
    if (!map[key]) map[key] = { name: t.assignedStaffName || 'Unassigned', tasks: [] }
    map[key].tasks.push(t)
  }
  return Object.values(map).map(s => ({
    label: s.name,
    value: calculateStaffProgress(s.tasks)
  }))
})

const activeStaffData = computed(() => {
  const map = {}
  for (const t of taskList.value) {
    const key = t.assignedStaffId || 'unassigned'
    if (!map[key]) map[key] = { name: t.assignedStaffName || 'Unassigned', count: 0 }
    map[key].count++
  }
  return Object.values(map).map(s => ({ label: s.name, value: s.count }))
})

const overdueList = computed(() =>
  tasksWithEffectiveStatus.value.filter(t => t.effectiveStatus === 'Overdue')
)
</script>

<style scoped>
.reports-page { display: flex; flex-direction: column; gap: 20px; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
.reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 16px; }
.overdue-list { display: flex; flex-direction: column; gap: 8px; }
.overdue-row {
  display: flex; align-items: center; gap: 10px; font-size: 0.875rem;
  padding: 8px 0; border-bottom: 1px solid var(--color-border);
}
.overdue-row:last-child { border-bottom: none; }
@media (max-width: 500px) { .reports-grid { grid-template-columns: 1fr; } }
</style>