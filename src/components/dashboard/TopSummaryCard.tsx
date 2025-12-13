import { useMemo } from "react"

type Period = "mes" | "semana" | "personalizado"

export default function TopSummaryCard({
  balance,
  periodLabel = "Resumo do mês atual",
  currentPeriod = "mes",
  onPeriodChange,
}: {
  balance: number
  periodLabel?: string
  currentPeriod?: Period
  onPeriodChange?: (p: Period) => void
}) {
  const positive = useMemo(() => balance >= 0, [balance])
  return (
    <div className="rounded-2xl shadow-sm p-4 bg-neutral-800 border border-neutral-700" data-testid="top-summary-card">
      <div className="text-neutral-300 text-sm">{periodLabel}</div>
      <div className={`mt-1 text-4xl font-bold ${positive ? "text-green-500" : "text-red-500"}`}>
        {balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-neutral-400 text-sm">Período:</span>
        <div className="inline-flex rounded-full border border-neutral-600 overflow-hidden">
          {(["mes", "semana", "personalizado"] as Period[]).map(p => (
            <button
              key={p}
              className={`px-3 py-1 text-sm ${currentPeriod === p ? "bg-sky-600 text-white" : "bg-neutral-700 text-neutral-200"}`}
              onClick={() => onPeriodChange?.(p)}
              aria-pressed={currentPeriod === p}
            >
              {p === "mes" ? "Mês" : p === "semana" ? "Semana" : "Pers."}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
