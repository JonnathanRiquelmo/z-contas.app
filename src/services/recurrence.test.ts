import { describe, it, expect } from "vitest"
import { generatePlanned } from "./recurrence"

describe("recurrence", () => {
  it("parcelado gera próximas parcelas", () => {
    const base = {
      id: "x",
      date: new Date("2025-01-10").getTime(),
      amount: -100,
      type: "saida",
      category: "Compra",
      accountId: "Casa",
      responsible: "Zilma",
      isRecurring: true,
      recurrence: {
        mode: "parcelado",
        interval: "monthly",
        amountPerInstallment: -100,
        installmentsTotal: 3,
        installmentsPaid: 0,
        startDate: new Date("2025-01-10").getTime(),
        endDate: null
      },
      originTxId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ownerUid: "u"
    } as any
    const next = generatePlanned(base)
    expect(next.length).toBe(3)
  })
})
