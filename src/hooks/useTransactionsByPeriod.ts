import { useEffect, useState } from "react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../config/firebase"
import type { Transaction } from "../domain/types"

export function useTransactionsByPeriod(uid: string | undefined, start: number, end: number) {
  const [rows, setRows] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
  useEffect(() => {
    if (!uid) return
    setLoading(true)
    const ref = collection(db, `users/${uid}/transactions`)
    const q = query(ref, where("date", ">=", start), where("date", "<=", end))
    const unsub = onSnapshot(
      q,
      snap => {
        const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Transaction) }))
        setRows(items)
        setLoading(false)
      },
      err => {
        setError(err)
        setRows([])
        setLoading(false)
      }
    )
    return () => unsub()
  }, [uid, start, end])
  return { rows, loading, error }
}

