import { useEffect, useState } from "react"

export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<any>(null)
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setPromptEvent(e)
    }
    window.addEventListener("beforeinstallprompt", handler as any)
    return () => window.removeEventListener("beforeinstallprompt", handler as any)
  }, [])
  async function install() {
    if (!promptEvent) return false
    await promptEvent.prompt()
    setPromptEvent(null)
    return true
  }
  return { canInstall: !!promptEvent, install }
}
