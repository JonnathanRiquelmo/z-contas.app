import { Recurrence, Transaction } from "../domain/types"

function addDays(ts: number, days: number) {
  const d = new Date(ts)
  d.setDate(d.getDate() + days)
  return d.getTime()
}

function addMonths(ts: number, months: number) {
  const d = new Date(ts)
  d.setMonth(d.getMonth() + months)
  return d.getTime()
}

function nextDate(ts: number, interval: Recurrence["interval"]) {
  if (interval === "daily") return addDays(ts, 1)
  if (interval === "weekly") return addDays(ts, 7)
  if (interval === "quinzenal") return addDays(ts, 14)
  return addMonths(ts, 1)
}

export function generatePlanned(tx: Transaction) {
  const result: Omit<Transaction, "id" | "createdAt" | "updatedAt">[] = []
  if (!tx.isRecurring || !tx.recurrence) return result
  const r = tx.recurrence
  if (r.mode === "parcelado") {
    let date = tx.date
    for (let i = r.installmentsPaid + 1; r.installmentsTotal && i <= r.installmentsTotal; i++) {
      date = nextDate(date, r.interval)
      result.push({
        ...tx,
        date,
        amount: r.amountPerInstallment,
        originTxId: tx.id,
        isRecurring: true,
        recurrence: r
      })
    }
  } else if (r.mode === "ate_data") {
    let date = tx.date
    while (r.endDate && nextDate(date, r.interval) <= r.endDate) {
      date = nextDate(date, r.interval)
      result.push({
        ...tx,
        date,
        originTxId: tx.id,
        isRecurring: true,
        recurrence: r
      })
    }
  } else {
    let count = 6
    let date = tx.date
    while (count > 0) {
      date = nextDate(date, r.interval)
      result.push({
        ...tx,
        date,
        originTxId: tx.id,
        isRecurring: true,
        recurrence: r
      })
      count--
    }
  }
  return result
}
