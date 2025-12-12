import { test, expect } from "@playwright/test"

test.skip("Onboarding salva preferências e vai para dashboard", async ({ page }) => {
  await page.goto("/")
  await page.goto("/onboarding")
  await expect(page.locator("text=Bem-vinda")).toBeVisible()
  await page.fill('input[placeholder="Conta padrão"]', "Casa")
  await page.click("text=Continuar")
  await expect(page.locator("text=Resumo")).toBeVisible()
})
