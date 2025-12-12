import { test, expect } from "@playwright/test"

test("Registrar várias transações com combinações e datas antigas", async ({ page }) => {
  const cases = [
    { tipo: "Entrada", valor: "150", data: "2023-01-10", categoria: "Mercado", conta: "Casa" },
    { tipo: "Saída", valor: "75", data: "2022-06-05", categoria: "Luz", conta: "Carteira" },
    { tipo: "Saída", valor: "250", data: "2024-12-01", categoria: "Remédios", conta: "Poupança" },
    { tipo: "Entrada", valor: "500", data: "2020-03-20", categoria: "Outros", conta: "Casa" },
    { tipo: "Saída", valor: "90", data: "2021-08-15", categoria: "Transporte", conta: "Carteira" }
  ]
  for (const c of cases) {
    await page.goto("/")
    await page.click("text=Registrar")
    await page.click(`text=${c.tipo}`)
    await page.fill('input[placeholder="0,00"]', c.valor)
    await page.fill('input[type="date"]', c.data)
    await page.locator('select').nth(0).selectOption({ label: c.categoria })
    await page.locator('select').nth(1).selectOption({ label: c.conta })
    await page.locator('select').nth(2).selectOption({ label: "Zilma" })
    await page.click("text=Confirmar")
    await page.waitForTimeout(500)
    await expect(page.locator('body')).toContainText(/Registrado|Offline/)
  }
})
