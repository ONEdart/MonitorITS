<template>
  <div class="task-page">
    <div class="page-header">
      <h1>Tasks</h1>
      <div class="header-actions">
        <select class="form-select" v-model="filterStatus" style="width:150px">
          <option value="">All Status</option>
          <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
        </select>
        <button class="btn btn-primary" @click="openCreate">+ New Task</button>
      </div>
    </div>

    <LoadingSkeleton v-if="loading" :count="6" />

    <div v-else-if="filteredTasks.length === 0" class="page-empty">
      <EmptyState
        title="No tasks"
        :description="filterStatus ? `No tasks with status '${filterStatus}'.` : 'Create your first task to get started.'"
        action-label="New Task"
        @action="openCreate"
      />
    </div>

    <SectionCard v-else>
      <DataTable :columns="columns" :rows="filteredTasks" @row-click="openEdit">
        <template #cell-status="{ row }">
          <StatusBadge :status="getEffectiveStatus(row)" />
        </template>
        <template #cell-priority="{ value }">
          <span class="badge" :style="priorityStyle(value)">{{ value }}</span>
        </template>
        <template #cell-progressPercent="{ value }">
          <ProgressBar :value="value" />
        </template>
        <template #cell-dueDate="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell-actions="{ row }">
          <button class="btn btn-ghost btn-xs" @click.stop="openEdit(row)">Edit</button>
          <button class="btn btn-ghost btn-xs" style="color:#b91c1c" @click.stop="promptDelete(row)">Del</button>
        </template>
      </DataTable>
    </SectionCard>

    <ModalForm v-if="showForm" :title="editingTask ? 'Edit Task' : 'New Task'" max-width="600px" @close="closeForm">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Title *</label>
          <input class="form-input" :class="{ error: errors.title }" v-model="form.title" />
          <span class="form-error" v-if="errors.title">{{ errors.title }}</span>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" v-model="form.description" rows="2"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group" style="flex:1">
            <label class="form-label">Assign To</label>
            <select class="form-select" v-model="form.assignedStaffId" @change="onStaffChange">
              <option value="">— Unassigned —</option>
              <option v-for="s in activeStaff" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label">Category</label>
            <input class="form-input" v-model="form.category" placeholder="e.g. Development" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group" style="flex:1">
            <label class="form-label">Status</label>
            <select class="form-select" v-model="form.status" @change="onStatusChange">
              <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label">Priority</label>
            <select class="form-select" v-model="form.priority">
              <option v-for="p in priorityOptions" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group" style="flex:1">
            <label class="form-label">Progress (%)</label>
            <input type="number" class="form-input" :class="{ error: errors.progressPercent }" v-model.number="form.progressPercent" min="0" max="100" />
            <span class="form-error" v-if="errors.progressPercent">{{ errors.progressPercent }}</span>
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label">Due Date</label>
            <input type="date" class="form-input" :class="{ error: errors.dueDate }" v-model="form.dueDate" />
            <span class="form-error" v-if="errors.dueDate">{{ errors.dueDate }}</span>
          </div>
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
      title="Delete Task"
      :message="`Delete '${taskToDelete?.title}'?`"
      @confirm="confirmDelete"
      @cancel="showDelete = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SectionCard from '@/components/SectionCard.vue'
import DataTable from '@/components/DataTable.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import ModalForm from '@/components/ModalForm.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useTasks } from '@/composables/useTasks'
import { useStaff } from '@/composables/useStaff'
import { getEffectiveStatus } from '@/utils/status'
import { PRIORITY_COLORS, TASK_STATUS, TASK_PRIORITY } from '@/utils/status'
import { formatDate, toISODate, fromISODate } from '@/utils/formatters'
import { validateTaskForm } from '@/utils/validators'

const { taskList, loading, fetchAll, create, update, remove } = useTasks()
const { activeStaff, fetchAll: fetchStaff } = useStaff()

const filterStatus = ref('')
const showForm = ref(false)
const editingTask = ref(null)
const showDelete = ref(false)
const taskToDelete = ref(null)
const saving = ref(false)
const errors = ref({})

const defaultForm = () => ({
  title: '', description: '', assignedStaffId: '', assignedStaffName: '',
  category: '', priority: 'Medium', status: 'To Do', progressPercent: 0,
  dueDate: '', startDate: toISODate(new Date()), notes: ''
})
const form = ref(defaultForm())

const statusOptions = Object.values(TASK_STATUS).filter(s => s !== 'Overdue')
const priorityOptions = Object.values(TASK_PRIORITY)

const columns = [
  { key: 'status', label: 'Status', width: '120px' },
  { key: 'title', label: 'Title' },
  { key: 'assignedStaffName', label: 'Staff', width: '140px' },
  { key: 'priority', label: 'Priority', width: '90px' },
  { key: 'progressPercent', label: 'Progress', width: '150px' },
  { key: 'dueDate', label: 'Due', width: '110px' },
  { key: 'actions', label: '', width: '100px' }
]

const filteredTasks = computed(() => {
  if (!filterStatus.value) return taskList.value
  return taskList.value.filter(t => getEffectiveStatus(t) === filterStatus.value)
})

function priorityStyle(p) {
  const c = PRIORITY_COLORS[p] || PRIORITY_COLORS['Medium']
  return { background: c.bg, color: c.text }
}

function onStaffChange() {
  const s = activeStaff.value.find(st => st.id === form.value.assignedStaffId)
  form.value.assignedStaffName = s?.name || ''
}

function onStatusChange() {
  if (form.value.status === 'Done') form.value.progressPercent = 100
}

onMounted(async () => {
  await Promise.all([fetchAll(), fetchStaff()])
})

function openCreate() {
  editingTask.value = null
  form.value = defaultForm()
  errors.value = {}
  showForm.value = true
}

function openEdit(task) {
  editingTask.value = task
  form.value = {
    ...task,
    dueDate: task.dueDate ? toISODate(task.dueDate) : '',
    startDate: task.startDate ? toISODate(task.startDate) : toISODate(new Date())
  }
  errors.value = {}
  showForm.value = true
}

function closeForm() { showForm.value = false }

async function save() {
  errors.value = validateTaskForm(form.value)
  if (Object.keys(errors.value).length) return
  saving.value = true
  const payload = { ...form.value }
  if (payload.dueDate) payload.dueDate = fromISODate(payload.dueDate)
  if (payload.startDate) payload.startDate = fromISODate(payload.startDate)
  try {
    if (editingTask.value) await update(editingTask.value.id, payload)
    else await create(payload)
    showForm.value = false
  } finally { saving.value = false }
}

function promptDelete(task) {
  taskToDelete.value = task
  showDelete.value = true
}

async function confirmDelete() {
  if (taskToDelete.value) await remove(taskToDelete.value.id)
  showDelete.value = false
}
</script>

<style scoped>
.task-page { display: flex; flex-direction: column; gap: 20px; }
.page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.header-actions { display: flex; gap: 8px; align-items: center; }
.page-empty { margin-top: 40px; }
.form-grid { display: flex; flex-direction: column; gap: 14px; }
.form-row { display: flex; gap: 12px; }
@media (max-width: 500px) { .form-row { flex-direction: column; } }
</style>