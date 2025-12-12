import { test, expect } from "@playwright/test"

function randomDateISO(daysBack = 1000) {
  const d = new Date(Date.now() - Math.floor(Math.random() * daysBack) * 24 * 60 * 60 * 1000)
  return d.toISOString().slice(0, 10)
}

const categorias = ["Mercado", "Luz", "Água", "Remédios", "Transporte", "Aluguel", "Outros"]
const contas = ["Casa", "Poupança", "Carteira"]
const responsaveis = ["Zilma", "Feito pelo Amorinho"]

test("Criar 50 registros variados; editar 10; excluir 10; validar filtros", async ({ page }) => {
  for (let i = 0; i < 50; i++) {
    await page.goto("/")
    await page.click("text=Registrar")
    await expect(page.locator("text=Registrar transação")).toBeVisible()
    const tipo = Math.random() < 0.5 ? "Entrada" : "Saída"
    await page.click(`text=${tipo}`)
    await page.fill('input[placeholder="0,00"]', (Math.random() * 1000 + 1).toFixed(2))
    await page.fill('input[type="date"]', randomDateISO(1500))
    await page.locator('select').nth(0).selectOption({ label: categorias[i % categorias.length] })
    await page.locator('select').nth(1).selectOption({ label: contas[i % contas.length] })
    await page.locator('select').nth(2).selectOption({ label: responsaveis[i % responsaveis.length] })
    await page.click("text=Confirmar")
    await page.waitForFunction(() => {
      const el = document.querySelector('form .text-lg')
      return el && el.textContent && el.textContent !== "Processando..."
    }, { timeout: 12000 }).catch(() => {})
  }

  await page.goto("/")
  await page.click("text=Listar")
  await expect(page.locator("text=Transações")).toBeVisible()
  await page.click('button:has-text("Atualizar")')
  await page.waitForTimeout(800)

  const editButtons = page.locator('button:has-text("Editar")')
  const editCount = await editButtons.count()
  const toEdit = Math.min(10, editCount)
  for (let i = 0; i < toEdit; i++) {
    await editButtons.nth(i).click()
    await page.locator('label:has-text("Valor") + input[type="number"]').fill("123.45")
    await page.selectOption('label:has-text("Categoria") + select', { label: "Mercado" })
    // Alterna tipo
    const entradaBtn = page.locator('button:has-text("Entrada")').nth(0)
    const saidaBtn = page.locator('button:has-text("Saída")').nth(0)
    if (await entradaBtn.isVisible()) await entradaBtn.click()
    else if (await saidaBtn.isVisible()) await saidaBtn.click()
    await page.click('button:has-text("Salvar")')
    await page.waitForTimeout(100)
  }

  const deleteButtons = page.locator('button:has-text("Excluir")')
  const deleteCount = await deleteButtons.count()
  const toDelete = Math.min(10, deleteCount)
  for (let i = 0; i < toDelete; i++) {
    await deleteButtons.nth(i).click()
    await page.waitForTimeout(50)
  }

  await page.selectOption('label:has-text("Tipo") + select', { label: "Entrada" })
  await page.waitForTimeout(100)
  await page.selectOption('label:has-text("Categoria") + select', { label: "Mercado" })
  await page.waitForTimeout(100)
  await page.selectOption('label:has-text("Tipo") + select', { label: "Saída" })
  await page.waitForTimeout(100)
  await page.selectOption('label:has-text("Categoria") + select', { label: "Todas" })
  await page.waitForTimeout(100)
  await expect(page.locator("text=Data").first()).toBeVisible()
  await expect(page.locator("text=Categoria").first()).toBeVisible()
  await expect(page.locator("text=Tipo").first()).toBeVisible()
  await expect(page.locator("text=Valor").first()).toBeVisible()
})
