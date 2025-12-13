type Item = { category: string; description?: string; amount: number; date: number }

function CategoryBadge({ category }: { category: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-sky-600/30 text-sky-300 flex items-center justify-center text-xs font-semibold">
      {category.slice(0, 2).toUpperCase()}
    </div>
  )
}

export default function RecentActivityList({ items }: { items: Item[] }) {
  return (
    <div className="rounded-2xl shadow-sm p-4 bg-neutral-800 border border-neutral-700" data-testid="recent-activity-list">
      <div className="text-neutral-300 text-sm mb-2">Últimos lançamentos</div>
      {items.length === 0 ? (
        <div className="text-neutral-400 text-sm">Sem lançamentos recentes</div>
      ) : (
        <div className="space-y-2">
          {items.slice(0, 3).map((it, i) => (
            <div key={i} className="flex items-center gap-3">
              <CategoryBadge category={it.category} />
              <div className="flex-1">
                <div className="text-neutral-100 text-sm">{it.description || it.category}</div>
                <div className="text-neutral-400 text-xs">{new Date(it.date).toLocaleDateString()}</div>
              </div>
              <div className={`${it.amount >= 0 ? "text-green-500" : "text-red-500"} text-sm font-semibold`}>
                {it.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
