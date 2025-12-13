import { initializeApp, applicationDefault } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080"
const projectId = process.env.FIREBASE_PROJECT_ID || "z-contas-app"

initializeApp({ credential: applicationDefault(), projectId })
const db = getFirestore()

const uid = "e2e-user"
const root = db.collection(`users/${uid}/transactions`)

function rand(min, max) { return Math.round((Math.random() * (max - min) + min) * 100) / 100 }
function dayTs(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() - offsetDays)
  d.setHours(12, 0, 0, 0)
  return d.getTime()
}

const cats = ["Mercado", "Contas", "Loja", "Farmácia", "Transporte"]
const people = ["Zilma", "Feito pelo Amorinho"]

async function run() {
  const batch = db.batch()
  for (let i = 0; i < 7; i++) {
    const date = dayTs(i)
    const income = {
      date,
      amount: rand(50, 300),
      type: "entrada",
      category: "Casa",
      description: "Receita diária",
      accountId: "default",
      responsible: people[i % people.length],
      isRecurring: false,
      recurrence: null,
      originTxId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ownerUid: uid,
    }
    const expense = {
      date,
      amount: -rand(30, 200),
      type: "saida",
      category: cats[i % cats.length],
      description: "Gasto diário",
      accountId: "default",
      responsible: people[(i + 1) % people.length],
      isRecurring: false,
      recurrence: null,
      originTxId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ownerUid: uid,
    }
    batch.set(root.doc(), income)
    batch.set(root.doc(), expense)
  }
  await batch.commit()
  console.log("Seed concluído para emulador Firestore (uid=e2e-user)")
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})

