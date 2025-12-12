import { useEffect, useMemo, useState } from "react"
import { useAuthState } from "../services/auth"
import { deleteTransaction, listTransactions, updateTransaction } from "../services/firestore"
import { enqueue } from "../services/offlineQueue"
import { useNavigate } from "react-router-dom"

type EditState = null | {
  id: string
  type: "entrada" | "saida"
  amount: string
  date: string
  category: string
  accountId: string
  responsible: "Zilma" | "Feito pelo Amorinho"
}

export default function TransactionsList() {
  const { user } = useAuthState()
  const navigate = useNavigate()
  const [rows, setRows] = useState<any[]>([])
  const [cursor, setCursor] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterType, setFilterType] = useState<"todas" | "entrada" | "saida">("todas")
  const [filterCategory, setFilterCategory] = useState<string>("")
  const [edit, setEdit] = useState<EditState>(null)

  function goBack() { navigate(-1) }

  const filtered = useMemo(() => {
    return rows.filter(r => (
      (filterType === "todas" || r.type === filterType) &&
      (!filterCategory || r.category === filterCategory)
    ))
  }, [rows, filterType, filterCategory])

  async function loadMore(reset = false) {
    if (!user) return
    setLoading(true)
    try {
      const { items, nextCursor } = await listTransactions(user.uid, {
        pageSize: 20,
        afterDate: reset ? null : cursor,
      })
      setRows(reset ? items : rows.concat(items))
      setCursor(nextCursor)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadMore(true) }, [user])

  function startEdit(r: any) {
    setEdit({
      id: r.id,
      type: r.type,
      amount: String(Math.abs(r.amount)),
      date: new Date(r.date).toISOString().slice(0,10),
      category: r.category,
      accountId: r.accountId,
      responsible: r.responsible,
    })
  }

  async function saveEdit() {
    if (!user || !edit) return
    const patch: any = {
      type: edit.type,
      amount: Number(edit.amount) * (edit.type === "saida" ? -1 : 1),
      date: new Date(edit.date).getTime(),
      category: edit.category,
      accountId: edit.accountId,
      responsible: edit.responsible,
    }
    try {
      await updateTransaction(user.uid, edit.id, patch)
      setRows(rows.map(r => r.id === edit.id ? { ...r, ...patch } : r))
      setEdit(null)
    } catch {
      await enqueue({ type: "update", uid: user.uid, id: edit.id, patch })
      setEdit(null)
    }
  }

  async function remove(id: string) {
    if (!user) return
    try {
      await deleteTransaction(user.uid, id)
      setRows(rows.filter(r => r.id !== id))
    } catch {
      await enqueue({ type: "delete", uid: user.uid, id })
      setRows(rows.filter(r => r.id !== id))
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <button className="bg-neutral-800 text-neutral-100 px-3 py-2 rounded text-lg" onClick={goBack}>Voltar</button>
      </div>
      <h1 className="text-2xl font-bold">Transações</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-lg mb-1">Tipo</label>
          <select className="w-full rounded border border-neutral-700 bg-neutral-800 text-neutral-100 p-3 text-lg" value={filterType} onChange={e=>setFilterType(e.target.value as any)}>
            <option value="todas">Todas</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>
        <div>
          <label className="block text-lg mb-1">Categoria</label>
          <select className="w-full rounded border border-neutral-700 bg-neutral-800 text-neutral-100 p-3 text-lg" value={filterCategory} onChange={e=>setFilterCategory(e.target.value)}>
            <option value="">Todas</option>
            <option>Mercado</option>
            <option>Luz</option>
            <option>Água</option>
            <option>Remédios</option>
            <option>Transporte</option>
            <option>Aluguel</option>
            <option>Outros</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="bg-primary text-white p-3 rounded text-lg" onClick={()=>loadMore(true)}>Atualizar</button>
        </div>
      </div>

      <div className="border border-neutral-700 rounded overflow-x-auto">
        <div className="grid grid-cols-5 font-semibold p-2 min-w-[720px]">
          <div>Data</div><div>Categoria</div><div>Tipo</div><div className="text-right">Valor</div><div className="text-right">Ações</div>
        </div>
        {filtered.map(r => (
          <div key={r.id} className="p-2 border-t border-neutral-700">
            <div className="grid grid-cols-5 items-center min-w-[720px]">
              <div className="truncate">{new Date(r.date).toLocaleDateString()}</div>
              <div className="truncate">{r.category}</div>
              <div className="truncate">{r.type}</div>
              <div className="text-right truncate">{r.amount.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</div>
              <div className="text-right space-x-2">
                <button className="px-2 py-1 rounded bg-neutral-800 text-neutral-100" onClick={()=>startEdit(r)}>Editar</button>
                <button className="px-2 py-1 rounded bg-red-600 text-white" onClick={()=>remove(r.id)}>Excluir</button>
              </div>
            </div>
            {edit && edit.id === r.id && (
              <div className="mt-3 p-3 rounded bg-neutral-800 text-neutral-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-lg mb-1">Tipo</label>
                    <div className="flex gap-3">
                      <button type="button" className={`flex-1 p-3 rounded ${edit.type === "entrada" ? "bg-accent text-white" : "border border-neutral-700"}`} onClick={()=>setEdit({ ...edit, type: "entrada" })}>Entrada</button>
                      <button type="button" className={`flex-1 p-3 rounded ${edit.type === "saida" ? "bg-red-600 text-white" : "border border-neutral-700"}`} onClick={()=>setEdit({ ...edit, type: "saida" })}>Saída</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-lg mb-1">Valor</label>
                    <input className="w-full rounded border border-neutral-700 bg-neutral-900 p-3 text-lg" type="number" step="0.01" inputMode="decimal" value={edit.amount} onChange={e=>setEdit({ ...edit, amount: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-lg mb-1">Data</label>
                    <input className="w-full rounded border border-neutral-700 bg-neutral-900 p-3 text-lg" type="date" value={edit.date} onChange={e=>setEdit({ ...edit, date: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-lg mb-1">Categoria</label>
                    <select className="w-full rounded border border-neutral-700 bg-neutral-900 p-3 text-lg" value={edit.category} onChange={e=>setEdit({ ...edit, category: e.target.value })}>
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
                    <select className="w-full rounded border border-neutral-700 bg-neutral-900 p-3 text-lg" value={edit.accountId} onChange={e=>setEdit({ ...edit, accountId: e.target.value })}>
                      <option>Casa</option>
                      <option>Poupança</option>
                      <option>Carteira</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-lg mb-1">Responsável</label>
                    <select className="w-full rounded border border-neutral-700 bg-neutral-900 p-3 text-lg" value={edit.responsible} onChange={e=>setEdit({ ...edit, responsible: e.target.value as any })}>
                      <option>Zilma</option>
                      <option>Feito pelo Amorinho</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3 flex gap-3 justify-end">
                  <button className="bg-primary text-white p-3 rounded text-lg" onClick={saveEdit}>Salvar</button>
                  <button className="bg-neutral-700 text-neutral-100 p-3 rounded text-lg" onClick={()=>setEdit(null)}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="p-3 text-center">
          <button disabled={loading || !cursor} className="bg-neutral-800 text-neutral-100 px-3 py-2 rounded text-lg disabled:opacity-60" onClick={()=>loadMore(false)}>Carregar mais</button>
        </div>
      </div>
    </div>
  )
}
