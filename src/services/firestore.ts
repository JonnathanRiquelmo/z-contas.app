import { db } from "../config/firebase"
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where, serverTimestamp } from "firebase/firestore"
import { Account, Settings, Transaction } from "../domain/types"

function userRoot(uid: string) {
  return {
    accounts: collection(db, `users/${uid}/accounts`),
    transactions: collection(db, `users/${uid}/transactions`),
    settings: collection(db, `users/${uid}/settings`)
  }
}

export async function upsertAccount(uid: string, account: Account) {
  const ref = doc(db, `users/${uid}/accounts/${account.id}`)
  await setDoc(ref, { ...account, ownerUid: uid })
}

export async function createTransaction(uid: string, tx: Omit<Transaction, "id" | "createdAt" | "updatedAt">) {
  const root = userRoot(uid)
  const created = await addDoc(root.transactions, {
    ...tx,
    ownerUid: uid,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    serverCreatedAt: serverTimestamp()
  })
  return created.id
}

export async function updateTransaction(uid: string, id: string, patch: Partial<Transaction>) {
  const ref = doc(db, `users/${uid}/transactions/${id}`)
  await updateDoc(ref, { ...patch, updatedAt: Date.now() })
}

export async function getTransactionsByPeriod(uid: string, start: number, end: number) {
  const root = userRoot(uid)
  const q = query(root.transactions, where("date", ">=", start), where("date", "<=", end))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Transaction) }))
}

export async function getSettings(uid: string) {
  const root = userRoot(uid)
  const snap = await getDocs(root.settings)
  const docs = snap.docs.map(d => ({ id: d.id, ...(d.data() as Settings) }))
  return docs[0]
}

export async function upsertSettings(uid: string, id: string, settings: Settings) {
  const ref = doc(db, `users/${uid}/settings/${id}`)
  await setDoc(ref, { ...settings, ownerUid: uid })
}
