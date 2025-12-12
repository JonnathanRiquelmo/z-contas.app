import { test, expect } from "@playwright/test"

test("Configurações: testar notificações não quebra a UI", async ({ page }) => {
  await page.goto("/")
  await page.click("text=Configurações")
  await page.click("text=Testar notificações")
  await expect(page.locator("text=Configurações")).toBeVisible()
})
