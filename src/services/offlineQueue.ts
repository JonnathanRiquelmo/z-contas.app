import localforage from "localforage"
import { createTransaction, updateTransaction, deleteTransaction } from "./firestore"

type QueueItem =
  | { type: "create"; uid: string; tx: any }
  | { type: "update"; uid: string; id: string; patch: any }
  | { type: "delete"; uid: string; id: string }

const store = localforage.createInstance({ name: "z-contas", storeName: "localQueue" })

export async function enqueue(item: QueueItem) {
  const list = ((await store.getItem<QueueItem[]>("items")) || []).concat(item)
  await store.setItem("items", list)
}

export async function processAll() {
  const list = (await store.getItem<QueueItem[]>("items")) || []
  const remaining: QueueItem[] = []
  for (const i of list) {
    try {
      if (i.type === "create") await createTransaction(i.uid, i.tx)
      if (i.type === "update") await updateTransaction(i.uid, i.id, i.patch)
      if (i.type === "delete") await deleteTransaction(i.uid, i.id)
    } catch {
      remaining.push(i)
    }
  }
  await store.setItem("items", remaining)
}
