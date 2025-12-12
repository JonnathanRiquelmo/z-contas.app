import { useEffect, useState } from "react"
import { auth } from "../config/firebase"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"

export function useAuthState() {
  const [user, setUser] = useState<null | { uid: string; email: string | null }>(null)
  const [initialized, setInitialized] = useState(false)
  useEffect(() => {
    const bypass = String(import.meta.env.VITE_E2E_BYPASS_AUTH || "false") === "true"
    if (bypass) {
      const logged = localStorage.getItem("E2E_LOGGED") !== "false"
      setUser(logged ? { uid: "e2e-user", email: "e2e@local" } : null)
      setInitialized(true)
      const handler = () => {
        const again = localStorage.getItem("E2E_LOGGED") !== "false"
        setUser(again ? { uid: "e2e-user", email: "e2e@local" } : null)
      }
      window.addEventListener("auth:changed", handler)
      return () => window.removeEventListener("auth:changed", handler)
    }
    return onAuthStateChanged(auth, u => {
      setUser(u ? { uid: u.uid, email: u.email } : null)
      setInitialized(true)
    })
  }, [])
  return { user, initialized }
}

export async function login(email: string, password: string) {
  const bypass = String(import.meta.env.VITE_E2E_BYPASS_AUTH || "false") === "true"
  if (bypass) localStorage.setItem("E2E_LOGGED", "true")
  await signInWithEmailAndPassword(auth, email, password)
}

export async function logout() {
  const bypass = String(import.meta.env.VITE_E2E_BYPASS_AUTH || "false") === "true"
  if (bypass) localStorage.setItem("E2E_LOGGED", "false")
  try { await signOut(auth) } catch {}
  if (bypass) {
    window.dispatchEvent(new Event("auth:changed"))
  }
}
