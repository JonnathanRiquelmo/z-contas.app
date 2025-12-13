import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

type Item = { category: string; value: number }

const palette = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#a78bfa", "#14b8a6"]

export default function CategoryPieMini({ data }: { data: Item[] }) {
  return (
    <div className="rounded-2xl shadow-sm p-4 bg-neutral-800 border border-neutral-700" data-testid="category-pie-mini">
      <div className="text-neutral-300 text-sm mb-2">Categorias (gastos)</div>
      <div className="h-36">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={30} outerRadius={55}>
              {data.map((_, i) => (
                <Cell key={i} fill={palette[i % palette.length]} stroke="#fff" />
              ))}
            </Pie>
            <Tooltip formatter={(v: any, n: any) => [(Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })), n]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
