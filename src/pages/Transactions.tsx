import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthState } from "../services/auth"
import { createTransaction } from "../services/firestore"
import { enqueue } from "../services/offlineQueue"

export default function Transactions() {
  const { user } = useAuthState()
  const navigate = useNavigate()
  const [type, setType] = useState<"entrada" | "saida">("entrada")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [category, setCategory] = useState("Mercado")
  const [accountId, setAccountId] = useState("Casa")
  const [responsible, setResponsible] = useState<"Zilma" | "Feito pelo Amorinho">("Zilma")
  const [status, setStatus] = useState("")

  function withTimeout<T>(p: Promise<T>, ms: number) {
    return new Promise<T>((resolve, reject) => {
      const id = setTimeout(() => reject(new Error("timeout")), ms)
      p.then(v => { clearTimeout(id); resolve(v) }).catch(e => { clearTimeout(id); reject(e) })
    })
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setStatus("Processando...")
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
      await withTimeout(createTransaction(user.uid, tx), 1500)
      setStatus("Registrado")
    } catch {
      await enqueue({ type: "create", uid: user.uid, tx })
      setStatus("Offline, enfileirado")
    }
  }

  function goBack() {
    navigate(-1)
  }
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <button className="bg-gray-200 px-3 py-2 rounded text-lg" onClick={goBack}>Voltar</button>
      </div>
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
        <div>
          <label className="block text-lg mb-1">Valor</label>
          <input className="w-full rounded border p-3 text-lg" type="number" step="0.01" inputMode="decimal" placeholder="0,00" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <input className="w-full rounded border p-3 text-lg" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <div>
          <label className="block text-lg mb-1">Categoria</label>
          <select className="w-full rounded border p-3 text-lg" value={category} onChange={e => setCategory(e.target.value)}>
            <option>Mercado</option>
            <option>Luz</option>
            <option>Água</option>
            <option>Remédios</option>
            <option>Transporte</option>
            <option>Aluguel</option>
            <option>Outros</option>
          </select>
        </div>
        <div>
          <label className="block text-lg mb-1">Conta</label>
          <select className="w-full rounded border p-3 text-lg" value={accountId} onChange={e => setAccountId(e.target.value)}>
            <option>Casa</option>
            <option>Poupança</option>
            <option>Carteira</option>
          </select>
        </div>
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
