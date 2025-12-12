import { test, expect } from "@playwright/test"

test.skip("Configurações permitem testar notificação", async ({ page }) => {
  await page.goto("/dashboard")
  await page.click("text=Configurações")
  await page.click("text=Testar notificações")
  await expect(page.locator("text=Configurações")).toBeVisible()
})
