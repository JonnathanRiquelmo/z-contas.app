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
