export async function ensurePermission() {
  if (Notification.permission === "granted") return true
  if (Notification.permission === "denied") return false
  const p = await Notification.requestPermission()
  return p === "granted"
}

export async function notify(title: string, body: string) {
  const ok = await ensurePermission()
  if (!ok) return
  if ("serviceWorker" in navigator) {
    const reg = await navigator.serviceWorker.getRegistration()
    if (reg) {
      reg.showNotification(title, { body })
      return
    }
  }
  new Notification(title, { body })
}
