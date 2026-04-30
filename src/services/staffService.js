import {
  db, collection, doc, addDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, serverTimestamp
} from '@/firebase'

const COLLECTION = 'staff'

export const staffService = {
  async getAll() {
    const q = query(collection(db, COLLECTION), orderBy('name'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async getById(id) {
    const d = await getDoc(doc(db, COLLECTION, id))
    if (!d.exists()) throw new Error('Staff not found')
    return { id: d.id, ...d.data() }
  },

  async getActive() {
    const q = query(collection(db, COLLECTION), where('active', '==', true), orderBy('name'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async create(data) {
    const payload = {
      ...data,
      active: data.active !== false,
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