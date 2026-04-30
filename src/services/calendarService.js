import {
  db, collection, doc, addDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, serverTimestamp
} from '@/firebase'

const COLLECTION = 'calendarEvents'

export const calendarService = {
  async getAll() {
    const q = query(collection(db, COLLECTION), orderBy('startDate', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async getByDateRange(start, end) {
    const q = query(
      collection(db, COLLECTION),
      where('startDate', '>=', start),
      where('startDate', '<=', end),
      orderBy('startDate')
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