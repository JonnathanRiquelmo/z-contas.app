import { Link, useNavigate } from "react-router-dom"
import { useAuthState } from "../services/auth"
import { logout } from "../services/auth"
import { useEffect, useMemo, useState } from "react"
import { getTransactionsByPeriod } from "../services/firestore"
import TopSummaryCard from "../components/dashboard/TopSummaryCard"
import TodayProgressRing from "../components/dashboard/TodayProgressRing"
import CommitmentsCard from "../components/dashboard/CommitmentsCard"
import WhoSpentTodayCard from "../components/dashboard/WhoSpentTodayCard"
import RecentActivityList from "../components/dashboard/RecentActivityList"
import WeeklyBars from "../components/dashboard/WeeklyBars"
import CategoryPieMini from "../components/dashboard/CategoryPieMini"
import type { Transaction } from "../domain/types"
import { useTransactionsByPeriod } from "../hooks/useTransactionsByPeriod"
import { rangeFor } from "../utils/dateRanges"
import type { Period } from "../utils/dateRanges"

export default function Dashboard() {
  const { user } = useAuthState()
  const navigate = useNavigate()
  const [period, setPeriod] = useState<Period>("mes")
  const [customRange, setCustomRange] = useState<{ start?: number; end?: number }>({})
  const { start, end } = rangeFor(period, customRange)
  const { rows, loading } = useTransactionsByPeriod(user?.uid, start, end)
  async function onLogout() {
    await logout()
    navigate("/login")
  }
  function goBack() {
    navigate(-1)
  }
  const income = useMemo(() => rows.filter(r => r.type === "entrada").reduce((s, r) => s + r.amount, 0), [rows])
  const expense = useMemo(() => rows.filter(r => r.type === "saida").reduce((s, r) => s + Math.abs(r.amount), 0), [rows])
  const balance = useMemo(() => income - expense, [income, expense])
  const todayRange = useMemo(() => {
    const now = new Date()
    return {
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate()).setHours(0, 0, 0, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate()).setHours(23, 59, 59, 999),
    }
  }, [])
  const todayIncome = useMemo(
    () => rows.filter(r => r.type === "entrada" && r.date >= todayRange.start && r.date <= todayRange.end).reduce((s, r) => s + r.amount, 0),
    [rows, todayRange]
  )
  const todayExpense = useMemo(
    () => rows.filter(r => r.type === "saida" && r.date >= todayRange.start && r.date <= todayRange.end).reduce((s, r) => s + Math.abs(r.amount), 0),
    [rows, todayRange]
  )
  const whoSpentToday = useMemo(() => {
    const names = ["Zilma", "Feito pelo Amorinho"] as const
    const byPerson = names.map(n => {
      const items = rows.filter(r => r.responsible === n && r.date >= todayRange.start && r.date <= todayRange.end)
      const sumIncome = items.filter(i => i.type === "entrada").reduce((s, i) => s + i.amount, 0)
      const sumExpense = items.filter(i => i.type === "saida").reduce((s, i) => s + Math.abs(i.amount), 0)
      const net = sumIncome - sumExpense
      return { name: n, amount: Math.abs(net), type: net >= 0 ? "income" : "expense" as const }
    })
    return byPerson
  }, [rows, todayRange])
  const recentItems = useMemo(() => {
    return [...rows].sort((a, b) => b.date - a.date).slice(0, 3).map(r => ({
      category: r.category,
      description: r.category,
      amount: r.type === "saida" ? -Math.abs(r.amount) : r.amount,
      date: r.date,
    }))
  }, [rows])
  const weeklySeries = useMemo(() => {
    const now = new Date()
    // Start on Monday
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
  }, [rows])
  const categoryPieData = useMemo(() => {
    const byCat: Record<string, number> = {}
    rows.filter(r => r.type === "saida").forEach(r => {
      byCat[r.category] = (byCat[r.category] || 0) + Math.abs(r.amount)
    })
    return Object.entries(byCat)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([category, value]) => ({ category, value }))
  }, [rows])
  const activeRecurringCount = useMemo(() => {
    const now = Date.now()
    return rows.filter(r => r.isRecurring && r.recurrence && (r.recurrence.endDate == null || r.recurrence.endDate > now)).length
  }, [rows])
  const nextDueDate = useMemo(() => {
    const now = Date.now()
    const nextDates: number[] = []
    rows.forEach(r => {
      const rec = r.recurrence
      if (!r.isRecurring || !rec) return
      if (rec.endDate != null && rec.endDate < now) return
      // naive next date: today or next interval from startDate
      let candidate = rec.startDate
      while (candidate < now) {
        candidate = addInterval(candidate, rec.interval)
        // safety break
        if (candidate - now > 365 * 24 * 60 * 60 * 1000) break
      }
      nextDates.push(candidate)
    })
    return nextDates.length ? Math.min(...nextDates) : null
  }, [rows])
  function addInterval(ts: number, interval: "monthly" | "weekly" | "daily" | "quinzenal") {
    const d = new Date(ts)
    switch (interval) {
      case "daily":
        d.setDate(d.getDate() + 1)
        break
      case "weekly":
        d.setDate(d.getDate() + 7)
        break
      case "quinzenal":
        d.setDate(d.getDate() + 15)
        break
      case "monthly":
      default:
        d.setMonth(d.getMonth() + 1)
        break
    }
    return d.getTime()
  }
  return (
    <div className="min-h-full p-4 space-y-6 bg-neutral-900 text-neutral-100">
      <div className="flex items-center justify-between">
        <div className="text-neutral-300 text-sm">Usuária: {user?.email}</div>
        <button className="bg-rose-500 text-white px-3 py-2 rounded text-lg hover:brightness-110" onClick={onLogout}>Sair</button>
      </div>
      <TopSummaryCard
        balance={balance}
        periodLabel={period === "mes" ? "Resumo do mês atual" : period === "semana" ? "Resumo da semana atual" : "Resumo personalizado"}
        currentPeriod={period}
        onPeriodChange={p => setPeriod(p)}
      />
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <TodayProgressRing todayIncome={todayIncome} todayExpense={todayExpense} />
          <CommitmentsCard activeCount={activeRecurringCount} nextDueDate={nextDueDate ?? undefined} />
        </div>
        <WhoSpentTodayCard items={whoSpentToday} />
        <RecentActivityList items={recentItems} />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <WeeklyBars series={weeklySeries} />
        <CategoryPieMini data={categoryPieData} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Link to="/transactions" className="bg-rose-500 text-white text-center p-4 rounded-2xl text-xl hover:brightness-110">
          Registrar
        </Link>
        <Link to="/transactions/list" className="bg-neutral-800 text-neutral-100 text-center p-4 rounded-2xl text-xl hover:brightness-110">
          Listar
        </Link>
      </div>
      <div className="flex gap-3">
        <Link to="/reports" className="flex-1 bg-sky-600 text-white text-center p-3 rounded-2xl text-lg hover:brightness-110">Relatórios</Link>
        <Link to="/settings" className="flex-1 bg-neutral-800 text-neutral-100 text-center p-3 rounded-2xl text-lg hover:brightness-110">Configurações</Link>
      </div>
    </div>
  )
}
