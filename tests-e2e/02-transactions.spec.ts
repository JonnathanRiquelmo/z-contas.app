import { test, expect } from "@playwright/test"

test.skip("Registrar transação exibe status", async ({ page }) => {
  await page.goto("/dashboard")
  await page.click("text=Registrar")
  await page.click("text=Entrada")
  await page.fill('input[placeholder="Valor"]', "123")
  await page.fill('input[placeholder="Categoria"]', "Teste")
  await page.fill('input[placeholder="Conta"]', "Casa")
  await page.click("text=Confirmar")
  await expect(page.locator("text=Registrado")).toBeVisible({ timeout: 5000 }).catch(async () => {
    await expect(page.locator("text=Offline, enfileirado")).toBeVisible()
  })
})
