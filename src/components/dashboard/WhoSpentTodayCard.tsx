type Item = { name: string; amount: number; type: "income" | "expense" }

export default function WhoSpentTodayCard({ items }: { items: Item[] }) {
  return (
    <div className="rounded-2xl shadow-sm p-4 bg-neutral-800 border border-neutral-700" data-testid="who-spent-today-card">
      <div className="text-neutral-300 text-sm">Hoje</div>
      {items.length === 0 ? (
        <div className="mt-2 text-neutral-400 text-sm">Sem lançamentos de pessoas hoje</div>
      ) : (
        <div className="mt-2 flex gap-3">
          {items.map((it, i) => (
            <div key={i} className="flex-1 rounded-xl bg-neutral-700 p-3">
              <div className="text-neutral-100 font-medium">{it.name}</div>
              <div className={`${it.type === "income" ? "text-green-500" : "text-red-500"} text-lg font-semibold`}>
                {it.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
