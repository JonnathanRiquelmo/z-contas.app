import { describe, it, expect } from "vitest"
import { buildWeeklySeries, buildCategoryPie, computeWhoSpentToday } from "./dashboard"

const now = new Date().setHours(12,0,0,0)

function day(offset: number) {
  const d = new Date()
  d.setDate(d.getDate() - offset)
  d.setHours(12,0,0,0)
  return d.getTime()
}

describe("dashboard utils", () => {
  const rows = [
    { type: "entrada", amount: 100, date: day(0), category: "Casa", responsible: "Zilma" },
    { type: "saida", amount: -50, date: day(0), category: "Mercado", responsible: "Feito pelo Amorinho" },
    { type: "entrada", amount: 200, date: day(2), category: "Casa", responsible: "Zilma" },
    { type: "saida", amount: -80, date: day(2), category: "Contas", responsible: "Zilma" },
  ] as any
  it("buildWeeklySeries retorna 7 pontos", () => {
    const pts = buildWeeklySeries(rows)
    expect(pts.length).toBe(7)
    const today = pts.find(p => p)
    expect(typeof pts[0].income).toBe("number")
  })
  it("buildCategoryPie agrega saídas por categoria", () => {
    const pie = buildCategoryPie(rows)
    const mercado = pie.find(p => p.category === "Mercado")
    const contas = pie.find(p => p.category === "Contas")
    expect(mercado?.value).toBe(50)
    expect(contas?.value).toBe(80)
  })
  it("computeWhoSpentToday discrimina por responsável", () => {
    const s = new Date().setHours(0,0,0,0)
    const e = new Date().setHours(23,59,59,999)
    const who = computeWhoSpentToday(rows, s, e)
    const zilma = who.find(w => w.name === "Zilma")
    const amorinho = who.find(w => w.name === "Feito pelo Amorinho")
    expect(zilma).toBeDefined()
    expect(amorinho).toBeDefined()
  })
})

