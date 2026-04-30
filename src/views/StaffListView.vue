<template>
  <div class="staff-page">
    <div class="page-header">
      <h1>Staff</h1>
      <button class="btn btn-primary" @click="openCreate">+ Add Staff</button>
    </div>

    <LoadingSkeleton v-if="loading" :count="4" />

    <div v-else-if="staffList.length === 0" class="page-empty">
      <EmptyState
        title="No staff yet"
        description="Add your first team member to start assigning tasks."
        action-label="Add Staff"
        @action="openCreate"
      />
    </div>

    <div v-else class="staff-grid">
      <StaffCard
        v-for="s in staffList"
        :key="s.id"
        :staff="s"
        @click="goToStaff(s.id)"
      />
    </div>

    <ModalForm v-if="showForm" :title="editingStaff ? 'Edit Staff' : 'New Staff'" @close="closeForm">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Name *</label>
          <input class="form-input" :class="{ error: errors.name }" v-model="form.name" placeholder="Full name" />
          <span class="form-error" v-if="errors.name">{{ errors.name }}</span>
        </div>
        <div class="form-group">
          <label class="form-label">Role</label>
          <input class="form-input" v-model="form.role" placeholder="e.g. Developer, Designer" />
        </div>
        <div class="form-group">
          <label class="form-label">Color</label>
          <input type="color" class="form-input" v-model="form.color" style="height:38px;padding:4px 8px" />
        </div>
        <div class="form-group">
          <label class="form-label">Notes</label>
          <textarea class="form-textarea" v-model="form.notes" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" v-model="form.active" /> Active
          </label>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-secondary" @click="closeForm">Cancel</button>
        <button class="btn btn-primary" @click="save" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
      </template>
    </ModalForm>

    <ConfirmDialog
      v-if="showDelete"
      title="Remove Staff"
      :message="`Remove ${staffToDelete?.name}? This cannot be undone.`"
      @confirm="confirmDelete"
      @cancel="showDelete = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StaffCard from '@/components/StaffCard.vue'
import ModalForm from '@/components/ModalForm.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useStaff } from '@/composables/useStaff'
import { validateStaffForm } from '@/utils/validators'

const router = useRouter()
const { staffList, loading, fetchAll, create, update, remove } = useStaff()

const showForm = ref(false)
const editingStaff = ref(null)
const showDelete = ref(false)
const staffToDelete = ref(null)
const saving = ref(false)
const form = ref({ name: '', role: '', color: '#3b82f6', notes: '', active: true })
const errors = ref({})

onMounted(() => fetchAll())

function goToStaff(id) { router.push(`/staff/${id}`) }

function openCreate() {
  editingStaff.value = null
  form.value = { name: '', role: '', color: '#3b82f6', notes: '', active: true }
  errors.value = {}
  showForm.value = true
}

function openEdit(staff) {
  editingStaff.value = staff
  form.value = { ...staff }
  errors.value = {}
  showForm.value = true
}

function closeForm() { showForm.value = false }

async function save() {
  errors.value = validateStaffForm(form.value)
  if (Object.keys(errors.value).length) return
  saving.value = true
  try {
    if (editingStaff.value) await update(editingStaff.value.id, form.value)
    else await create(form.value)
    showForm.value = false
  } finally {
    saving.value = false
  }
}

function promptDelete(staff) {
  staffToDelete.value = staff
  showDelete.value = true
}

async function confirmDelete() {
  if (staffToDelete.value) await remove(staffToDelete.value.id)
  showDelete.value = false
}
</script>

<style scoped>
.staff-page { display: flex; flex-direction: column; gap: 20px; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.staff-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
.page-empty { margin-top: 40px; }
.form-grid { display: flex; flex-direction: column; gap: 16px; }
</style>