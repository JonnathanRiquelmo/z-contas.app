export function shareText(text: string) {
  const waDesktop = "https://web.whatsapp.com/send?text="
  const waMobile = "https://wa.me/?text="
  if (navigator.share) {
    navigator.share({ text }).catch(() => window.open(waMobile + encodeURIComponent(text), "_blank"))
    return
  }
  const url = /Android|iPhone|iPad/i.test(navigator.userAgent) ? waMobile : waDesktop
  window.open(url + encodeURIComponent(text), "_blank")
}

export function shareFileOrDownload(file: Blob, filename: string) {
  const fileUrl = URL.createObjectURL(file)
  if ((navigator as any).canShare && (navigator as any).canShare({ files: [new File([file], filename, { type: file.type })] })) {
    ;(navigator as any)
      .share({ files: [new File([file], filename, { type: file.type })] })
      .catch(() => download(fileUrl, filename))
    return
  }
  download(fileUrl, filename)
}

function download(url: string, filename: string) {
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export function shareDashboardSummary(params: {
  periodLabel: string
  sumIn: number
  sumOut: number
  sumBal: number
  topCats: Array<{ name: string; value: number }>
  lastTxs: Array<{ date: number; category: string; description?: string; amount: number }>
}) {
  const { periodLabel, sumIn, sumOut, sumBal, topCats, lastTxs } = params
  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  const header = `Z-Contas — ${periodLabel}`
  const totals = `Entradas: ${fmt(sumIn)}\nSaídas: ${fmt(sumOut)}\nSaldo: ${fmt(sumBal)}`
  const cats = topCats.slice(0, 3).map(c => `${c.name}: ${fmt(c.value)}`).join(" • ")
  const txs = lastTxs.slice(0, 2).map(t => {
    const d = new Date(t.date).toLocaleDateString()
    const desc = t.description || t.category
    return `• ${d} — ${desc}: ${fmt(t.amount)}`
  }).join("\n")
  const body = `${header}\n\n${totals}\n\nTop categorias: ${cats || "—"}\n\nÚltimos:\n${txs || "—"}`
  return shareText(body)
}
