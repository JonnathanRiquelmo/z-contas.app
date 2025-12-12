import { Link, useNavigate } from "react-router-dom"
import { useAuthState } from "../services/auth"
import { logout } from "../services/auth"
import { useEffect, useMemo, useState } from "react"
import { getTransactionsByPeriod } from "../services/firestore"

export default function Dashboard() {
  const { user } = useAuthState()
  const navigate = useNavigate()
  const [rows, setRows] = useState<Array<{ amount: number; type: "entrada" | "saida" }>>([])
  const [loading, setLoading] = useState(false)
  async function onLogout() {
    await logout()
    navigate("/login")
  }
  function goBack() {
    navigate(-1)
  }
  useEffect(() => {
    async function load() {
      if (!user) return
      setLoading(true)
      try {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1).setHours(0, 0, 0, 0)
        const end = new Date().setHours(23, 59, 59, 999)
        const txs = await getTransactionsByPeriod(user.uid, start, end)
        setRows(txs.map(t => ({ amount: t.amount, type: t.type })))
      } catch {
        setRows([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])
  const income = useMemo(() => rows.filter(r => r.type === "entrada").reduce((s, r) => s + r.amount, 0), [rows])
  const expense = useMemo(() => rows.filter(r => r.type === "saida").reduce((s, r) => s + Math.abs(r.amount), 0), [rows])
  const balance = useMemo(() => income - expense, [income, expense])
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-end">
        <button className="bg-red-600 text-white px-3 py-2 rounded text-lg" onClick={onLogout}>Sair</button>
      </div>
      <h1 className="text-2xl font-bold">Resumo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-neutral-700 rounded">
          <div className="text-lg">Entradas (mês)</div>
          <div className="text-2xl font-bold">{income.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
        </div>
        <div className="p-4 border border-neutral-700 rounded">
          <div className="text-lg">Saídas (mês)</div>
          <div className="text-2xl font-bold">{expense.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
        </div>
        <div className={`p-4 border border-neutral-700 rounded ${balance < 0 ? "bg-red-600/20" : "bg-green-600/20"}`}>
          <div className="text-lg">Saldo (mês)</div>
          <div className="text-2xl font-bold">{balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Link to="/transactions" className="bg-accent text-white text-center p-4 rounded text-xl">
          Registrar
        </Link>
        <Link to="/transactions/list" className="bg-neutral-800 text-neutral-100 text-center p-4 rounded text-xl">
          Listar
        </Link>
      </div>
      <div className="flex gap-3">
        <Link to="/reports" className="flex-1 bg-primary text-white text-center p-3 rounded text-lg">Relatórios</Link>
        <Link to="/settings" className="flex-1 bg-neutral-800 text-neutral-100 text-center p-3 rounded text-lg">Configurações</Link>
      </div>
      <div className="text-sm">Usuária: {user?.email}</div>
    </div>
  )
}
