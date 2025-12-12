import { db } from "../config/firebase"
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where, serverTimestamp, deleteDoc, orderBy, limit as fbLimit, startAfter } from "firebase/firestore"
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

export async function deleteTransaction(uid: string, id: string) {
  const ref = doc(db, `users/${uid}/transactions/${id}`)
  await deleteDoc(ref)
}

export async function getTransactionsByPeriod(uid: string, start: number, end: number) {
  const root = userRoot(uid)
  const q = query(root.transactions, where("date", ">=", start), where("date", "<=", end))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Transaction) }))
}

export async function listTransactions(uid: string, opts?: { pageSize?: number; afterDate?: number | null; type?: Transaction["type"]; category?: string }) {
  const { pageSize = 20, afterDate = null, type, category } = opts || {}
  const root = userRoot(uid)
  let q: any = query(root.transactions, orderBy("date", "desc"))
  if (type) q = query(q, where("type", "==", type))
  if (category) q = query(q, where("category", "==", category))
  if (afterDate != null) q = query(q, startAfter(afterDate))
  q = query(q, fbLimit(pageSize))
  const snap = await getDocs(q)
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Transaction) }))
  const nextCursor = items.length ? items[items.length - 1].date : null
  return { items, nextCursor }
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
