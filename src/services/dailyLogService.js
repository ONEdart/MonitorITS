import {
  db, collection, doc, addDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, serverTimestamp
} from '@/firebase'

const COLLECTION = 'dailyLogs'

export const dailyLogService = {
  async getAll() {
    const q = query(collection(db, COLLECTION), orderBy('date', 'desc'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async getByStaff(staffId) {
    const q = query(
      collection(db, COLLECTION),
      where('staffId', '==', staffId),
      orderBy('date', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async getByTask(taskId) {
    const q = query(
      collection(db, COLLECTION),
      where('taskId', '==', taskId),
      orderBy('date', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async getByDateRange(startDate, endDate) {
    const q = query(
      collection(db, COLLECTION),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async create(data) {
    const payload = {
      ...data,
      createdAt: serverTimestamp()
    }
    const ref = await addDoc(collection(db, COLLECTION), payload)
    return { id: ref.id, ...payload }
  },

  async update(id, data) {
    await updateDoc(doc(db, COLLECTION, id), data)
    return { id, ...data }
  },

  async remove(id) {
    await deleteDoc(doc(db, COLLECTION, id))
  }
}