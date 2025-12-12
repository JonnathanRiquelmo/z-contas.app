import { test, expect } from "@playwright/test"

test("CRUD: registrar transação e validar feedback; editor inline e filtros existem", async ({ page, context }) => {
  await page.goto("/")
  await expect(page.locator("text=Resumo")).toBeVisible()
  await page.click("text=Registrar")
  await expect(page.locator("text=Registrar transação")).toBeVisible()

  await page.click("text=Entrada")
  await page.fill('input[type="number"]', "123.45")
  const today = new Date().toISOString().slice(0, 10)
  await page.fill('input[type="date"]', today)
  await page.selectOption('label:has-text("Categoria") + select', { label: "Mercado" })
  await page.selectOption('label:has-text("Conta") + select', { label: "Casa" })
  await page.selectOption('label:has-text("Responsável") + select', { label: "Zilma" })

  await page.click("text=Confirmar")
  const statusEl = page.locator('form .text-lg').last()
  await expect(statusEl).toHaveText(/Registrado|Offline/, { timeout: 10000 })

  await page.goto("/")
  await page.click("text=Listar")
  await expect(page.locator("text=Transações")).toBeVisible()

  await expect(page.locator('label:has-text("Tipo") + select')).toBeVisible()
  await expect(page.locator('label:has-text("Categoria") + select')).toBeVisible()
  await page.selectOption('label:has-text("Tipo") + select', { label: "Entrada" })
  await page.selectOption('label:has-text("Categoria") + select', { label: "Todas" })

  await expect(page.locator("text=Data").first()).toBeVisible()
  await expect(page.locator("text=Categoria").first()).toBeVisible()
  await expect(page.locator("text=Tipo").first()).toBeVisible()
  await expect(page.locator("text=Valor").first()).toBeVisible()
  await expect(page.locator("text=Ações").first()).toBeVisible()

  const loadMore = page.locator('button:has-text("Carregar mais")')
  await expect(loadMore).toBeVisible()
  await expect(loadMore).toBeDisabled()
})
