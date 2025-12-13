import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

type Point = { day: string; income: number; expense: number }

export default function WeeklyBars({ series }: { series: Point[] }) {
  return (
    <div className="rounded-2xl shadow-sm p-4 bg-neutral-800 border border-neutral-700" data-testid="weekly-bars">
      <div className="text-neutral-300 text-sm mb-2">Semana</div>
      <div className="h-44">
        <ResponsiveContainer>
          <BarChart data={series}>
            <XAxis dataKey="day" stroke="#e5e7eb" />
            <YAxis tickFormatter={(v: number) => v.toLocaleString("pt-BR")} stroke="#e5e7eb" />
            <Tooltip formatter={(v: any, n: any) => [(Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })), n]} />
            <Legend />
            <Bar dataKey="income" name="Receitas" fill="#16a34a" />
            <Bar dataKey="expense" name="Despesas" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
