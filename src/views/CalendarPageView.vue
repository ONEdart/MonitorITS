<template>
  <div class="calendar-page">
    <div class="page-header">
      <h1>Calendar</h1>
      <button class="btn btn-primary" @click="openCreate">+ Add Event</button>
    </div>

    <LoadingSkeleton v-if="loading" :count="3" />

    <template v-else>
      <CalendarViewCmp @event-click="openEdit" />

      <SectionCard title="Upcoming Deadlines" style="margin-top:20px">
        <div v-if="upcomingTasks.length" class="deadline-list">
          <div v-for="t in upcomingTasks" :key="t.id" class="deadline-row">
            <StatusBadge :status="getEffectiveStatus(t)" />
            <span>{{ t.title }}</span>
            <span class="deadline-date">{{ formatDate(t.dueDate) }}</span>
            <span class="deadline-staff">{{ t.assignedStaffName || '—' }}</span>
          </div>
        </div>
        <EmptyState v-else title="No upcoming deadlines" description="All clear." />
      </SectionCard>
    </template>

    <ModalForm v-if="showForm" :title="editingEvent ? 'Edit Event' : 'New Event'" @close="closeForm">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Title *</label>
          <input class="form-input" v-model="form.title" />
        </div>
        <div class="form-group">
          <label class="form-label">Type</label>
          <select class="form-select" v-model="form.type">
            <option value="deadline">Deadline</option>
            <option value="meeting">Meeting</option>
            <option value="milestone">Milestone</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group" style="flex:1">
            <label class="form-label">Start Date</label>
            <input type="date" class="form-input" v-model="form.startDate" />
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label">End Date</label>
            <input type="date" class="form-input" v-model="form.endDate" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Color</label>
          <input type="color" class="form-input" v-model="form.color" style="height:38px" />
        </div>
        <div class="form-group">
          <label class="form-label">Notes</label>
          <textarea class="form-textarea" v-model="form.notes" rows="2"></textarea>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-secondary" @click="closeForm">Cancel</button>
        <button class="btn btn-primary" @click="save">Save</button>
      </template>
    </ModalForm>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CalendarViewCmp from '@/components/CalendarViewCmp.vue'
import SectionCard from '@/components/SectionCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ModalForm from '@/components/ModalForm.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useCalendar } from '@/composables/useCalendar'
import { useTasks } from '@/composables/useTasks'
import { getEffectiveStatus } from '@/utils/status'
import { formatDate, toISODate } from '@/utils/formatters'

const { events, loading: calLoading, fetchAll, create, update } = useCalendar()
const { taskList, fetchAll: fetchTasks } = useTasks()

const loading = ref(true)
const showForm = ref(false)
const editingEvent = ref(null)

const defaultForm = () => ({
  title: '', type: 'deadline', startDate: toISODate(new Date()),
  endDate: '', color: '#3b82f6', notes: '', staffId: '', taskId: ''
})
const form = ref(defaultForm())

const upcomingTasks = computed(() => {
  const now = new Date()
  const future = new Date()
  future.setDate(future.getDate() + 14)
  return taskList.value
    .filter(t => {
      if (!t.dueDate || t.status === 'Done') return false
      const d = t.dueDate?.toDate ? t.dueDate.toDate() : new Date(t.dueDate)
      return d >= now && d <= future
    })
    .sort((a, b) => {
      const da = a.dueDate?.toDate ? a.dueDate.toDate() : new Date(a.dueDate)
      const db = b.dueDate?.toDate ? b.dueDate.toDate() : new Date(b.dueDate)
      return da - db
    })
})

onMounted(async () => {
  await Promise.all([calLoading ? fetchAll() : Promise.resolve(), fetchTasks()])
  loading.value = false
})

function openCreate() {
  editingEvent.value = null
  form.value = defaultForm()
  showForm.value = true
}

function openEdit(evt) {
  editingEvent.value = evt
  form.value = {
    ...evt,
    startDate: evt.startDate ? toISODate(evt.startDate) : '',
    endDate: evt.endDate ? toISODate(evt.endDate) : ''
  }
  showForm.value = true
}

function closeForm() { showForm.value = false }

async function save() {
  if (editingEvent.value) await update(editingEvent.value.id, form.value)
  else await create(form.value)
  showForm.value = false
}
</script>

<style scoped>
.calendar-page { display: flex; flex-direction: column; gap: 20px; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.deadline-list { display: flex; flex-direction: column; gap: 6px; }
.deadline-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 0; border-bottom: 1px solid var(--color-border); font-size: 0.875rem;
}
.deadline-row:last-child { border-bottom: none; }
.deadline-date { color: var(--color-text-muted); font-size: 0.8125rem; }
.deadline-staff { color: var(--color-accent); font-size: 0.8125rem; margin-left: auto; }
.form-grid { display: flex; flex-direction: column; gap: 14px; }
.form-row { display: flex; gap: 12px; }
</style>