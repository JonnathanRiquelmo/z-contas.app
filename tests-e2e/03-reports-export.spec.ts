import { test, expect } from "@playwright/test"

test.skip("Relatórios exportam CSV e PDF", async ({ page }) => {
  await page.goto("/dashboard")
  await page.click("text=Relatórios")
  const csv = await Promise.all([
    page.waitForEvent("download"),
    page.click("text=Exportar CSV")
  ])
  expect(await csv[0].suggestedFilename()).toContain("relatorio")
  const pdf = await Promise.all([
    page.waitForEvent("download"),
    page.click("text=Exportar PDF")
  ])
  expect(await pdf[0].suggestedFilename()).toContain("relatorio")
})
