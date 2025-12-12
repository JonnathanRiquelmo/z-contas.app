import { useEffect, useMemo, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { shareText } from "../services/share"
import Papa from "papaparse"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { useAuthState } from "../services/auth"
import { getTransactionsByPeriod } from "../services/firestore"
import { useNavigate } from "react-router-dom"

type Item = { name: string; value: number }

export default function Reports() {
  const navigate = useNavigate()
  function goBack() { navigate(-1) }
  const { user } = useAuthState()
  const [start, setStart] = useState<string>(new Date().toISOString().slice(0,10))
  const [end, setEnd] = useState<string>(new Date().toISOString().slice(0,10))
  const [selected, setSelected] = useState<number | null>(null)
  const [rows, setRows] = useState<Array<{ category: string; amount: number; type: string; date: number }>>([])
  const items: Item[] = useMemo(() => {
    const onlyExpenses = rows.filter(r => r.type === "saida")
    const byCat: Record<string, number> = {}
    for (const r of onlyExpenses) byCat[r.category] = (byCat[r.category]||0) + Math.abs(r.amount)
    return Object.entries(byCat).map(([name, value]) => ({ name, value }))
  }, [rows])
  useEffect(() => {
    async function load() {
      if (!user) return
      const s = new Date(start).setHours(0,0,0,0)
      const e = new Date(end).setHours(23,59,59,999)
      const txs = await getTransactionsByPeriod(user.uid, s, e)
      setRows(txs.map(t => ({ category: t.category, amount: t.amount, type: t.type, date: t.date })))
    }
    load()
  }, [user, start, end])

  async function exportCSV() {
    const csv = Papa.unparse(rows.map(r => ({ data: new Date(r.date).toLocaleDateString(), categoria: r.category, valor: r.amount })))
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "relatorio.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  async function exportPDF() {
    const pdf = new jsPDF("p", "mm", "a4")
    pdf.text("Relatório Z-Contas", 10, 10)
    pdf.text(`Período: ${new Date(start).toLocaleDateString()} a ${new Date(end).toLocaleDateString()}`, 10, 18)
    // Tabela simples
    let y = 26
    pdf.text("Data", 10, y); pdf.text("Categoria", 50, y); pdf.text("Valor", 130, y)
    y += 6
    rows.slice(0, 30).forEach(r => {
      pdf.text(new Date(r.date).toLocaleDateString(), 10, y)
      pdf.text(r.category, 50, y)
      pdf.text((r.amount).toLocaleString("pt-BR", { style:"currency", currency:"BRL" }), 130, y)
      y += 6
    })
    // Gráfico
    const el = document.getElementById("chart")
    if (el) {
      const canvas = await html2canvas(el)
      const img = canvas.toDataURL("image/png")
      pdf.addImage(img, "PNG", 10, y + 4, 180, 100)
    }
    pdf.save("relatorio.pdf")
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <button className="bg-gray-200 px-3 py-2 rounded text-lg" onClick={goBack}>Voltar</button>
      </div>
      <h1 className="text-2xl font-bold">Relatórios</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-lg mb-1">Início</label>
          <input type="date" className="w-full rounded border p-3 text-lg" value={start} onChange={e=>setStart(e.target.value)} />
        </div>
        <div>
          <label className="block text-lg mb-1">Fim</label>
          <input type="date" className="w-full rounded border p-3 text-lg" value={end} onChange={e=>setEnd(e.target.value)} />
        </div>
        <div className="flex items-end">
          <div className="text-lg">Gastos no período: {items.reduce((sum,i)=>sum+i.value,0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</div>
        </div>
      </div>
      <div id="chart" className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={items} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} onClick={(_,i)=>setSelected(i)}>
              {items.map((entry, index) => (
                <Cell key={index} stroke={selected===index?"#000":"#fff"} strokeWidth={selected===index?3:1} fill={["#0ea5e9", "#22c55e", "#f97316", "#ef4444", "#a78bfa"][index % 5]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: any, n: any)=>[(Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})), n]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {selected!=null && items[selected] && (
        <div className="p-3 border rounded text-lg">Seleção: {items[selected].name} — {items[selected].value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</div>
      )}
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Gastos discriminados</h2>
        <div className="border rounded">
          <div className="grid grid-cols-3 font-semibold p-2">
            <div>Data</div><div>Categoria</div><div className="text-right">Valor</div>
          </div>
          {rows.filter(r=>r.type==="saida").map((r,i)=> (
            <div key={i} className="grid grid-cols-3 p-2 border-t">
              <div>{new Date(r.date).toLocaleDateString()}</div>
              <div>{r.category}</div>
              <div className="text-right">{r.amount.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button className="flex-1 bg-primary text-white p-3 rounded text-lg" onClick={exportPDF}>Exportar PDF</button>
        <button className="flex-1 bg-gray-800 text-white p-3 rounded text-lg" onClick={exportCSV}>Exportar CSV</button>
      </div>
      <button className="w-full bg-accent text-white p-3 rounded text-lg" onClick={() => shareText("Relatório Z-Contas pronto")}>
        Compartilhar
      </button>
    </div>
  )
}
