import { useState } from "react"
import { useAuthState } from "../services/auth"
import { createTransaction } from "../services/firestore"
import { enqueue } from "../services/offlineQueue"

export default function Transactions() {
  const { user } = useAuthState()
  const [type, setType] = useState<"entrada" | "saida">("entrada")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [category, setCategory] = useState("Mercado")
  const [accountId, setAccountId] = useState("Casa")
  const [responsible, setResponsible] = useState<"Zilma" | "Feito pelo Amorinho">("Zilma")
  const [status, setStatus] = useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    const tx = {
      date: new Date(date).getTime(),
      amount: Number(amount) * (type === "saida" ? -1 : 1),
      type,
      category,
      description: "",
      accountId,
      responsible,
      isRecurring: false,
      recurrence: null,
      originTxId: null,
      ownerUid: user.uid
    }
    try {
      await createTransaction(user.uid, tx)
      setStatus("Registrado")
    } catch {
      await enqueue({ type: "create", uid: user.uid, tx })
      setStatus("Offline, enfileirado")
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Registrar transação</h1>
      <form onSubmit={submit} className="space-y-3">
        <div className="flex gap-3">
          <button type="button" className={`flex-1 p-3 rounded ${type === "entrada" ? "bg-accent text-white" : "border"}`} onClick={() => setType("entrada")}>
            Entrada
          </button>
          <button type="button" className={`flex-1 p-3 rounded ${type === "saida" ? "bg-red-600 text-white" : "border"}`} onClick={() => setType("saida")}>
            Saída
          </button>
        </div>
        <input className="w-full rounded border p-3 text-lg" placeholder="Valor" value={amount} onChange={e => setAmount(e.target.value)} />
        <input className="w-full rounded border p-3 text-lg" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input className="w-full rounded border p-3 text-lg" placeholder="Categoria" value={category} onChange={e => setCategory(e.target.value)} />
        <input className="w-full rounded border p-3 text-lg" placeholder="Conta" value={accountId} onChange={e => setAccountId(e.target.value)} />
        <div className="flex items-center gap-3">
          <label className="text-lg">Responsável</label>
          <select className="rounded border p-2 text-lg" value={responsible} onChange={e => setResponsible(e.target.value as any)}>
            <option>Zilma</option>
            <option>Feito pelo Amorinho</option>
          </select>
        </div>
        <button className="w-full bg-primary text-white p-3 rounded text-lg">Confirmar</button>
        <div className="text-lg">{status}</div>
      </form>
    </div>
  )
}
