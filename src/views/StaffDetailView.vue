<template>
  <div class="staff-detail">
    <div class="back-row">
      <button class="btn btn-ghost" @click="$router.push('/staff')">&larr; Back to Staff</button>
    </div>

    <div v-if="loadingStaff" class="skeleton-grid">
      <LoadingSkeleton :count="4" />
    </div>

    <template v-else-if="staff">
      <div class="staff-profile">
        <div class="staff-avatar-lg" :style="{ background: staff.color || '#64748b' }">
          {{ initials }}
        </div>
        <div>
          <h1>{{ staff.name }}</h1>
          <p class="staff-role-text">{{ staff.role || 'No role assigned' }}</p>
          <span v-if="staff.active === false" class="badge" style="background:#fee2e2;color:#991b1b;">Inactive</span>
        </div>
      </div>

      <div class="stats-grid">
        <StatCard label="Tasks" :value="staffTasks.length" />
        <StatCard label="Progress" :value="staffProgress" format="percent" :variant="staffProgress >= 70 ? 'success' : staffProgress >= 30 ? 'warning' : 'danger'" />
        <StatCard label="Completed" :value="completedCount" variant="success" />
        <StatCard label="Overdue" :value="overdueCount" variant="danger" />
      </div>

      <SectionCard title="Tasks">
        <div v-if="staffTasks.length" class="task-list">
          <div v-for="t in staffTasks" :key="t.id" class="task-row" @click="$router.push('/tasks')">
            <StatusBadge :status="getEffectiveStatus(t)" />
            <span class="task-title">{{ t.title }}</span>
            <span class="task-priority">{{ t.priority }}</span>
            <ProgressBar :value="t.progressPercent || 0" />
            <span class="task-date">{{ formatDate(t.dueDate) }}</span>
          </div>
        </div>
        <EmptyState v-else title="No tasks assigned" description="Assign tasks to this staff member." />
      </SectionCard>

      <SectionCard title="Recent Logs">
        <div v-if="staffLogs.length" class="log-list">
          <div v-for="l in staffLogs.slice(0, 10)" :key="l.id" class="log-row">
            <span class="log-date">{{ formatDate(l.date) }}</span>
            <span class="log-task">{{ l.taskTitle || '—' }}</span>
            <span class="log-note">{{ l.notes || l.progressUpdate || '—' }}</span>
          </div>
        </div>
        <EmptyState v-else title="No log entries" description="No daily logs recorded yet." />
      </SectionCard>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import StatCard from '@/components/StatCard.vue'
import SectionCard from '@/components/SectionCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useStaff } from '@/composables/useStaff'
import { useTasks } from '@/composables/useTasks'
import { useDailyLogs } from '@/composables/useDailyLogs'
import { getEffectiveStatus } from '@/utils/status'
import { formatDate } from '@/utils/formatters'
import { calculateStaffProgress, getOverdueCount, getTaskCompletionRate } from '@/utils/calculations'
import { useAppState } from '@/composables/useAppState'

const route = useRoute()
const { currentStaff: staff, fetchById, loading: loadingStaff } = useStaff()
const { taskList: staffTasks, fetchByStaff: fetchTasksByStaff } = useTasks()
const { logList: staffLogs, fetchByStaff: fetchLogsByStaff } = useDailyLogs()
const { setStaffMode, clearStaffMode } = useAppState()

const staffProgress = computed(() => calculateStaffProgress(staffTasks.value))
const completedCount = computed(() => staffTasks.value.filter(t => t.status === 'Done').length)
const overdueCount = computed(() => getOverdueCount(staffTasks.value))

const initials = computed(() => {
  if (!staff.value) return '?'
  return staff.value.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
})

onMounted(async () => {
  const id = route.params.id
  await fetchById(id)
  await fetchTasksByStaff(id)
  await fetchLogsByStaff(id)
  if (staff.value) setStaffMode(staff.value)
})

watch(() => route.params.id, async (id) => {
  await fetchById(id)
  await fetchTasksByStaff(id)
  await fetchLogsByStaff(id)
  if (staff.value) setStaffMode(staff.value)
})
</script>

<style scoped>
.staff-detail { display: flex; flex-direction: column; gap: 20px; }
.back-row { margin-bottom: 0; }
.staff-profile { display: flex; align-items: center; gap: 16px; }
.staff-avatar-lg {
  width: 56px; height: 56px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 1.25rem;
}
.staff-role-text { color: var(--color-text-secondary); font-size: 0.9375rem; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
.task-list, .log-list { display: flex; flex-direction: column; gap: 6px; }
.task-row {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 0; border-bottom: 1px solid var(--color-border);
  cursor: pointer; font-size: 0.875rem;
}
.task-row:last-child { border-bottom: none; }
.task-title { flex: 1; font-weight: 500; }
.task-priority { font-size: 0.75rem; color: var(--color-text-muted); }
.task-date { font-size: 0.75rem; color: var(--color-text-muted); white-space: nowrap; }
.log-row { display: flex; gap: 12px; font-size: 0.8125rem; padding: 6px 0; border-bottom: 1px solid var(--color-border); }
.log-row:last-child { border-bottom: none; }
.log-date { width: 90px; color: var(--color-text-muted); flex-shrink: 0; }
.log-task { width: 140px; font-weight: 500; flex-shrink: 0; }
.log-note { color: var(--color-text-secondary); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>