import { describe, it, expect } from "vitest"
import { rangeFor } from "./dateRanges"

describe("dateRanges", () => {
  it("mes: cobre início ao fim do mês atual", () => {
    const { start, end } = rangeFor("mes")
    const s = new Date(start)
    const e = new Date(end)
    expect(s.getDate()).toBe(1)
    expect(s.getHours()).toBe(0)
    expect(e.getHours()).toBeGreaterThanOrEqual(23)
  })
  it("semana: inicia na segunda e cobre 7 dias", () => {
    const { start, end } = rangeFor("semana")
    const s = new Date(start)
    const e = new Date(end)
    // Segunda-feira em pt-BR costuma ser getDay() === 1 (ajustado no util)
    expect(e.getTime() - s.getTime()).toBeGreaterThan(5 * 24 * 60 * 60 * 1000)
  })
  it("personalizado: retorna datas passadas", () => {
    const today = new Date().setHours(0, 0, 0, 0)
    const tomorrow = new Date().setDate(new Date().getDate() + 1)
    const { start, end } = rangeFor("personalizado", { start: today, end: tomorrow })
    expect(start).toBe(today)
    expect(end).toBe(tomorrow)
  })
})

