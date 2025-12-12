import { test, expect } from "@playwright/test"

test("Dashboard exibe Sair e não tem Voltar; logout vai ao Login", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("text=Resumo")).toBeVisible()
  await expect(page.locator("text=Sair")).toBeVisible()
  expect(await page.locator("text=Voltar").count()).toBe(0)
  await page.click("text=Sair")
  await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible()
})
