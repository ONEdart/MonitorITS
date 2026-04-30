<template>
  <div class="logbook-page">
    <div class="page-header">
      <h1>Daily Logbook</h1>
      <button class="btn btn-primary" @click="openCreate">+ New Entry</button>
    </div>

    <div class="filters-row">
      <select class="form-select" v-model="filterStaff" style="width:180px">
        <option value="">All Staff</option>
        <option v-for="s in staffList" :key="s.id" :value="s.id">{{ s.name }}</option>
      </select>
    </div>

    <LoadingSkeleton v-if="loading" :count="5" />

    <div v-else-if="filteredLogs.length === 0" class="page-empty">
      <EmptyState title="No log entries" description="Start recording daily activity." action-label="New Entry" @action="openCreate" />
    </div>

    <SectionCard v-else>
      <div class="log-list">
        <div v-for="l in filteredLogs" :key="l.id" class="log-entry">
          <div class="log-meta">
            <span class="log-date">{{ formatDate(l.date) }}</span>
            <span class="log-staff">{{ l.staffName || '—' }}</span>
            <StatusBadge v-if="l.status" :status="l.status" />
          </div>
          <div class="log-body">
            <strong v-if="l.taskTitle">{{ l.taskTitle }}</strong>
            <p v-if="l.progressUpdate">{{ l.progressUpdate }}</p>
            <p v-if="l.obstacle" class="log-obstacle">⚠ {{ l.obstacle }}</p>
            <p v-if="l.notes" class="log-note">{{ l.notes }}</p>
          </div>
          <div class="log-actions">
            <button class="btn btn-ghost btn-xs" @click="openEdit(l)">Edit</button>
            <button class="btn btn-ghost btn-xs" style="color:#b91c1c" @click="promptDelete(l)">Del</button>
          </div>
        </div>
      </div>
    </SectionCard>

    <ModalForm v-if="showForm" :title="editingLog ? 'Edit Log Entry' : 'New Log Entry'" @close="closeForm">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Date *</label>
          <input type="date" class="form-input" :class="{ error: errors.date }" v-model="form.date" />
          <span class="form-error" v-if="errors.date">{{ errors.date }}</span>
        </div>
        <div class="form-group">
          <label class="form-label">Staff *</label>
          <select class="form-select" :class="{ error: errors.staffId }" v-model="form.staffId" @change="onStaffChange">
            <option value="">— Select —</option>
            <option v-for="s in staffList" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
          <span class="form-error" v-if="errors.staffId">{{ errors.staffId }}</span>
        </div>
        <div class="form-group">
          <label class="form-label">Task</label>
          <select class="form-select" v-model="form.taskId" @change="onTaskChange">
            <option value="">— Optional —</option>
            <option v-for="t in staffTaskOptions" :key="t.id" :value="t.id">{{ t.title }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" v-model="form.status">
            <option value="">— None —</option>
            <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Progress Update</label>
          <textarea class="form-textarea" v-model="form.progressUpdate" rows="2"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Obstacle / Blocker</label>
          <textarea class="form-textarea" v-model="form.obstacle" rows="2" placeholder="Any issues encountered?"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Notes</label>
          <textarea class="form-textarea" v-model="form.notes" rows="2"></textarea>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-secondary" @click="closeForm">Cancel</button>
        <button class="btn btn-primary" @click="save" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
      </template>
    </ModalForm>

    <ConfirmDialog
      v-if="showDelete"
      title="Delete Log Entry"
      message="Remove this log entry?"
      @confirm="confirmDelete"
      @cancel="showDelete = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SectionCard from '@/components/SectionCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ModalForm from '@/components/ModalForm.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useDailyLogs } from '@/composables/useDailyLogs'
import { useStaff } from '@/composables/useStaff'
import { useTasks } from '@/composables/useTasks'
import { formatDate, toISODate, fromISODate } from '@/utils/formatters'
import { TASK_STATUS } from '@/utils/status'
import { validateLogForm } from '@/utils/validators'

const { logList, loading, fetchAll, create, update, remove } = useDailyLogs()
const { staffList, fetchAll: fetchStaff } = useStaff()
const { taskList, fetchAll: fetchTasks } = useTasks()

const filterStaff = ref('')
const showForm = ref(false)
const editingLog = ref(null)
const showDelete = ref(false)
const logToDelete = ref(null)
const saving = ref(false)
const errors = ref({})
const statusOptions = Object.values(TASK_STATUS).filter(s => s !== 'Overdue')

const defaultForm = () => ({
  date: toISODate(new Date()), staffId: '', staffName: '',
  taskId: '', taskTitle: '', progressUpdate: '', obstacle: '', notes: '', status: ''
})
const form = ref(defaultForm())

const filteredLogs = computed(() => {
  if (!filterStaff.value) return logList.value
  return logList.value.filter(l => l.staffId === filterStaff.value)
})

const staffTaskOptions = computed(() => {
  if (!form.value.staffId) return taskList.value
  return taskList.value.filter(t => t.assignedStaffId === form.value.staffId)
})

function onStaffChange() {
  form.value.taskId = ''
  form.value.taskTitle = ''
  const s = staffList.value.find(st => st.id === form.value.staffId)
  form.value.staffName = s?.name || ''
}

function onTaskChange() {
  const t = taskList.value.find(tk => tk.id === form.value.taskId)
  form.value.taskTitle = t?.title || ''
}

onMounted(async () => {
  await Promise.all([fetchAll(), fetchStaff(), fetchTasks()])
})

function openCreate() {
  editingLog.value = null
  form.value = defaultForm()
  errors.value = {}
  showForm.value = true
}

function openEdit(log) {
  editingLog.value = log
  form.value = {
    ...log,
    date: log.date ? toISODate(log.date) : toISODate(new Date())
  }
  errors.value = {}
  showForm.value = true
}

function closeForm() { showForm.value = false }

async function save() {
  errors.value = validateLogForm(form.value)
  if (Object.keys(errors.value).length) return
  saving.value = true
  const payload = { ...form.value }
  if (payload.date) payload.date = fromISODate(payload.date)
  try {
    if (editingLog.value) await update(editingLog.value.id, payload)
    else await create(payload)
    showForm.value = false
  } finally { saving.value = false }
}

function promptDelete(log) {
  logToDelete.value = log
  showDelete.value = true
}

async function confirmDelete() {
  if (logToDelete.value) await remove(logToDelete.value.id)
  showDelete.value = false
}
</script>

<style scoped>
.logbook-page { display: flex; flex-direction: column; gap: 20px; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.filters-row { display: flex; gap: 10px; }
.log-list { display: flex; flex-direction: column; gap: 0; }
.log-entry {
  padding: 14px 0; border-bottom: 1px solid var(--color-border);
  display: flex; gap: 16px;
}
.log-entry:last-child { border-bottom: none; }
.log-meta { display: flex; flex-direction: column; gap: 4px; width: 140px; flex-shrink: 0; }
.log-date { font-weight: 600; font-size: 0.875rem; }
.log-staff { font-size: 0.8125rem; color: var(--color-accent); }
.log-body { flex: 1; font-size: 0.875rem; }
.log-obstacle { color: #b45309; font-size: 0.8125rem; }
.log-note { color: var(--color-text-secondary); font-size: 0.8125rem; }
.log-actions { display: flex; gap: 4px; flex-shrink: 0; }
.page-empty { margin-top: 40px; }
.form-grid { display: flex; flex-direction: column; gap: 14px; }
</style>