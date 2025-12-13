import type { Transaction } from "../domain/types"

export function buildWeeklySeries(rows: Pick<Transaction, "type" | "amount" | "date">[]) {
  const now = new Date()
  const day = now.getDay() || 7
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - (day - 1))
  startOfWeek.setHours(0, 0, 0, 0)
  const points: { day: string; income: number; expense: number }[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    const s = new Date(d).setHours(0, 0, 0, 0)
    const e = new Date(d).setHours(23, 59, 59, 999)
    const incomeDay = rows.filter(r => r.type === "entrada" && r.date >= s && r.date <= e).reduce((sum, r) => sum + r.amount, 0)
    const expenseDay = rows.filter(r => r.type === "saida" && r.date >= s && r.date <= e).reduce((sum, r) => sum + Math.abs(r.amount), 0)
    points.push({ day: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""), income: incomeDay, expense: expenseDay })
  }
  return points
}

export function buildCategoryPie(rows: Pick<Transaction, "type" | "amount" | "category">[]) {
  const byCat: Record<string, number> = {}
  rows.filter(r => r.type === "saida").forEach(r => {
    byCat[r.category] = (byCat[r.category] || 0) + Math.abs(r.amount)
  })
  return Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([category, value]) => ({ category, value }))
}

export function computeWhoSpentToday(
  rows: Pick<Transaction, "type" | "amount" | "date" | "responsible">[],
  start: number,
  end: number
) {
  const names = ["Zilma", "Feito pelo Amorinho"] as const
  return names.map(n => {
    const items = rows.filter(r => r.responsible === n && r.date >= start && r.date <= end)
    const sumIncome = items.filter(i => i.type === "entrada").reduce((s, i) => s + i.amount, 0)
    const sumExpense = items.filter(i => i.type === "saida").reduce((s, i) => s + Math.abs(i.amount), 0)
    const net = sumIncome - sumExpense
    return { name: n, amount: Math.abs(net), type: net >= 0 ? "income" : "expense" as const }
  })
}

