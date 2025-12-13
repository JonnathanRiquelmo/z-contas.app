export type Period = "mes" | "semana" | "personalizado"

export function rangeFor(period: Period, custom?: { start?: number; end?: number }) {
  const now = new Date()
  if (period === "mes") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1).setHours(0, 0, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).setHours(23, 59, 59, 999)
    return { start, end }
  }
  if (period === "semana") {
    const day = now.getDay() || 7
    const startDate = new Date(now)
    startDate.setDate(now.getDate() - (day - 1))
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    return { start: startDate.setHours(0, 0, 0, 0), end: endDate.setHours(23, 59, 59, 999) }
  }
  const start = custom?.start ?? new Date(now.getFullYear(), now.getMonth(), 1).setHours(0, 0, 0, 0)
  const end = custom?.end ?? new Date().setHours(23, 59, 59, 999)
  return { start, end }
}

