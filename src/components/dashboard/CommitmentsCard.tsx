export default function CommitmentsCard({
  activeCount,
  nextDueDate,
}: {
  activeCount: number
  nextDueDate?: number | null
}) {
  return (
    <div className="rounded-2xl shadow-sm p-4 bg-neutral-800 border border-neutral-700" data-testid="commitments-card">
      <div className="text-neutral-300 text-sm">Parcelas / Recorrências ativas</div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="px-2 py-1 rounded-full bg-rose-500/20 text-rose-300 text-sm">{activeCount}</div>
        {nextDueDate ? (
          <div className="text-neutral-400 text-sm">Próx. vencimento: {new Date(nextDueDate).toLocaleDateString()}</div>
        ) : (
          <div className="text-neutral-500 text-sm">Sem vencimentos próximos</div>
        )}
      </div>
    </div>
  )
}
