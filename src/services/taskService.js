import {
  db, collection, doc, addDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, serverTimestamp
} from '@/firebase'

const COLLECTION = 'tasks'

export const taskService = {
  async getAll() {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async getById(id) {
    const d = await getDoc(doc(db, COLLECTION, id))
    if (!d.exists()) throw new Error('Task not found')
    return { id: d.id, ...d.data() }
  },

  async getByStaff(staffId) {
    const q = query(
      collection(db, COLLECTION),
      where('assignedStaffId', '==', staffId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async getByStatus(status) {
    const q = query(
      collection(db, COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async create(data) {
    const payload = {
      ...data,
      progressPercent: data.progressPercent || 0,
      status: data.status || 'To Do',
      priority: data.priority || 'Medium',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    const ref = await addDoc(collection(db, COLLECTION), payload)
    return { id: ref.id, ...payload }
  },

  async update(id, data) {
    const payload = { ...data, updatedAt: serverTimestamp() }
    await updateDoc(doc(db, COLLECTION, id), payload)
    return { id, ...payload }
  },

  async remove(id) {
    await deleteDoc(doc(db, COLLECTION, id))
  }
}