import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function TodayProgressRing({
  todayIncome,
  todayExpense,
}: {
  todayIncome: number
  todayExpense: number
}) {
  const data = [
    { name: "Receitas", value: Math.max(0, todayIncome) },
    { name: "Despesas", value: Math.max(0, Math.abs(todayExpense)) },
  ]
  const colors = ["#16a34a", "#ef4444"]
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="rounded-2xl shadow-sm p-4 bg-neutral-800 border border-neutral-700" data-testid="today-progress-ring">
      <div className="text-neutral-300 text-sm mb-2">Hoje</div>
      <div className="h-40 relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70}>
              {data.map((entry, index) => (
                <Cell key={index} fill={colors[index % colors.length]} stroke="#fff" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-xs text-neutral-400">Hoje</div>
          <div className="text-lg font-semibold text-neutral-100">
            {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
          <span className="text-neutral-300">Receitas</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
          <span className="text-neutral-300">Despesas</span>
        </div>
      </div>
    </div>
  )
}
