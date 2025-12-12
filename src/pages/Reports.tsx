import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { shareText } from "../services/share"
import Papa from "papaparse"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

type Item = { name: string; value: number }

export default function Reports() {
  const [items] = useState<Item[]>([
    { name: "Mercado", value: 300 },
    { name: "Luz", value: 120 },
    { name: "Venda", value: 800 }
  ])

  async function exportCSV() {
    const csv = Papa.unparse(items.map(i => ({ categoria: i.name, valor: i.value })))
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
    const el = document.getElementById("chart")
    if (!el) return
    const canvas = await html2canvas(el)
    const img = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    pdf.text("Relatório Z-Contas", 10, 10)
    pdf.addImage(img, "PNG", 10, 20, 180, 100)
    pdf.save("relatorio.pdf")
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Relatórios</h1>
      <div id="chart" className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={items} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {items.map((entry, index) => (
                <Cell key={index} fill={["#0ea5e9", "#22c55e", "#f97316"][index % 3]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
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
