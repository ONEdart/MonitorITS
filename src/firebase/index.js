import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtV6jlcBWfAUkrXAZTnO83ot9_6jddAu8",
  authDomain: "monitorits.firebaseapp.com",
  projectId: "monitorits",
  storageBucket: "monitorits.firebasestorage.app",
  messagingSenderId: "496282597788",
  appId: "1:496282597788:web:1270519c1ce90687b9f059",
  measurementId: "G-CVSYT6EN5C"
}

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig)

// Firestore
const db = getFirestore(app)

// Analytics — TIDAK diinisialisasi untuk mencegah crash di environment terbatas
const analytics = null

export {
  db,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  writeBatch,
  analytics
}