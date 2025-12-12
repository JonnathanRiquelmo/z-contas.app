import { useEffect, useState } from "react"
import { auth } from "../config/firebase"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"

export function useAuthState() {
  const [user, setUser] = useState<null | { uid: string; email: string | null }>(null)
  const [initialized, setInitialized] = useState(false)
  useEffect(() => {
    const bypass = String(import.meta.env.VITE_E2E_BYPASS_AUTH || "false") === "true"
    if (bypass) {
      setUser({ uid: "e2e-user", email: "e2e@local" })
      setInitialized(true)
      return
    }
    return onAuthStateChanged(auth, u => {
      setUser(u ? { uid: u.uid, email: u.email } : null)
      setInitialized(true)
    })
  }, [])
  return { user, initialized }
}

export async function login(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function logout() {
  await signOut(auth)
}
