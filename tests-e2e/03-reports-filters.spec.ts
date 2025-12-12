import { test, expect } from "@playwright/test"

test("Relatórios: período, gráfico presente e exportações CSV/PDF funcionam", async ({ page }) => {
  await page.goto("/")
  await page.click("text=Relatórios")
  await expect(page.locator("text=Relatórios")).toBeVisible()

  const startInput = page.locator('label:has-text("Início") + input[type="date"]')
  const endInput = page.locator('label:has-text("Fim") + input[type="date"]')
  const today = new Date()
  const start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const end = today.toISOString().slice(0, 10)
  await startInput.fill(start)
  await endInput.fill(end)

  await page.waitForTimeout(500)
  await expect(page.locator("#chart")).toBeVisible()

  const [csv] = await Promise.all([
    page.waitForEvent("download"),
    page.click('button:has-text("Exportar CSV")')
  ])
  const csvName = await csv.suggestedFilename()
  expect(csvName.toLowerCase()).toContain("relatorio")

  const [pdf] = await Promise.all([
    page.waitForEvent("download"),
    page.click('button:has-text("Exportar PDF")')
  ])
  const pdfName = await pdf.suggestedFilename()
  expect(pdfName.toLowerCase()).toContain("relatorio")
})

test("Listagem: filtros de Tipo e Categoria alteram estado sem quebrar UI", async ({ page }) => {
  await page.goto("/")
  await page.click("text=Listar")
  await expect(page.locator("text=Transações")).toBeVisible()
  await page.selectOption('label:has-text("Tipo") + select', { label: "Saída" })
  await page.selectOption('label:has-text("Categoria") + select', { label: "Mercado" })
  await page.selectOption('label:has-text("Tipo") + select', { label: "Todas" })
  await page.selectOption('label:has-text("Categoria") + select', { label: "Todas" })
  await expect(page.locator("text=Data")).toBeVisible()
})
