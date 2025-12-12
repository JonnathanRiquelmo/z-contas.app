import { initializeApp } from "firebase/app"
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  connectAuthEmulator
} from "firebase/auth"
import {
  initializeFirestore,
  persistentLocalCache,
  connectFirestoreEmulator,
  getFirestore
} from "firebase/firestore"

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
})

export const auth = getAuth(app)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
})

setPersistence(auth, browserLocalPersistence)

const useEmulator = String(import.meta.env.VITE_USE_EMULATOR || "false") === "true"
if (useEmulator) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099")
  connectFirestoreEmulator(db, "127.0.0.1", 8080)
}

export async function devAutoLogin() {
  const email = import.meta.env.VITE_DEV_EMAIL
  const password = import.meta.env.VITE_DEV_PASSWORD
  if (useEmulator && email && password) {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {}
  }
}
