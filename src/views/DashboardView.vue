<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="filter-row">
        <select class="form-select" v-model="period" style="width:140px">
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="skeleton-grid">
      <LoadingSkeleton :count="3" v-for="i in 2" :key="i" />
    </div>

    <template v-else>
      <div class="stats-grid">
        <StatCard label="Total Staff" :value="staffList.length" variant="info" />
        <StatCard label="Active Tasks" :value="activeTasks" variant="default" />
        <StatCard label="Completed" :value="completedTasks" variant="success" />
        <StatCard label="Overdue" :value="overdueCount" variant="danger" />
        <StatCard label="Team Progress" :value="teamProgress" format="percent" variant="info" />
      </div>

      <div class="dashboard-grid">
        <SectionCard title="Task by Status">
          <SimpleChart type="horizontal" :data="statusChartData" />
        </SectionCard>

        <SectionCard title="Progress per Staff">
          <SimpleChart type="bar" :data="staffChartData" suffix="%" />
        </SectionCard>

        <SectionCard title="Urgent Tasks">
          <div v-if="urgentTasks.length" class="task-list-compact">
            <div v-for="t in urgentTasks.slice(0, 5)" :key="t.id" class="task-row">
              <StatusBadge :status="getEffectiveStatus(t)" />
              <span class="task-row-title">{{ t.title }}</span>
              <span class="task-row-staff">{{ t.assignedStaffName || '—' }}</span>
            </div>
          </div>
          <EmptyState v-else title="No urgent tasks" description="All clear." />
        </SectionCard>

        <SectionCard title="Staff Needing Attention">
          <div v-if="staffNeedingAttention.length" class="task-list-compact">
            <div v-for="s in staffNeedingAttention" :key="s.staffId" class="task-row attention-row" @click="goToStaff(s.staffId)">
              <span class="staff-dot" :style="{ background: s.color }"></span>
              <span>{{ s.staffName }}</span>
              <span class="badge" style="background:#fee2e2;color:#991b1b;">{{ s.overdue }} overdue</span>
            </div>
          </div>
          <EmptyState v-else title="All staff on track" description="No one needs immediate attention." />
        </SectionCard>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import StatCard from '@/components/StatCard.vue'
import SectionCard from '@/components/SectionCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import SimpleChart from '@/components/SimpleChart.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useStaff } from '@/composables/useStaff'
import { useTasks } from '@/composables/useTasks'
import { getEffectiveStatus } from '@/utils/status'
import { groupByStatus, calculateStaffProgress, getTaskCompletionRate, getActiveTaskCount, getOverdueCount } from '@/utils/calculations'

const router = useRouter()
const { staffList, fetchAll: fetchStaff } = useStaff()
const { taskList, tasksWithEffectiveStatus, urgentTasks, fetchAll: fetchTasks } = useTasks()

const period = ref('month')
const loading = ref(true)

onMounted(async () => {
  await Promise.all([fetchStaff(), fetchTasks()])
  loading.value = false
})

const activeTasks = computed(() => getActiveTaskCount(taskList.value))
const completedTasks = computed(() => taskList.value.filter(t => t.status === 'Done').length)
const overdueCount = computed(() => getOverdueCount(taskList.value))

const teamProgress = computed(() => {
  if (!taskList.value.length) return 0
  return Math.round(taskList.value.reduce((s, t) => s + (t.progressPercent || 0), 0) / taskList.value.length)
})

const statusChartData = computed(() => {
  const groups = groupByStatus(taskList.value)
  return Object.entries(groups).map(([k, v]) => ({ label: k, value: v }))
})

const staffChartData = computed(() => {
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

const staffNeedingAttention = computed(() => {
  const map = {}
  for (const t of tasksWithEffectiveStatus.value) {
    if (t.effectiveStatus === 'Overdue') {
      const key = t.assignedStaffId || 'unassigned'
      if (!map[key]) map[key] = {
        staffId: key,
        staffName: t.assignedStaffName || 'Unassigned',
        color: getStaffColor(key),
        overdue: 0
      }
      map[key].overdue++
    }
  }
  return Object.values(map).filter(s => s.overdue > 0)
})

function getStaffColor(staffId) {
  return staffList.value.find(s => s.id === staffId)?.color || '#64748b'
}

function goToStaff(id) {
  if (id !== 'unassigned') router.push(`/staff/${id}`)
}
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 24px; }
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 16px;
}
.task-list-compact { display: flex; flex-direction: column; gap: 8px; }
.task-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.875rem;
}
.task-row:last-child { border-bottom: none; }
.task-row-title { flex: 1; font-weight: 500; }
.task-row-staff { color: var(--color-text-muted); font-size: 0.8125rem; }
.attention-row { cursor: pointer; }
.attention-row:hover { background: var(--color-bg); margin: 0 -8px; padding-left: 8px; padding-right: 8px; border-radius: 4px; }
.staff-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.skeleton-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 16px; }
@media (max-width: 500px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .dashboard-grid { grid-template-columns: 1fr; }
}
</style>