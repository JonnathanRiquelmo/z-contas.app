import { test, expect } from "@playwright/test"

test("App carrega título e root", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/Z-Contas/i)
  await expect(page.locator("#root")).toBeVisible()
})
