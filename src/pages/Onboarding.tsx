import { useAuthState } from "../services/auth"
import { upsertSettings } from "../services/firestore"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Onboarding() {
  const { user } = useAuthState()
  const [defaultAccountName, setDefaultAccountName] = useState("Casa")
  const [notifications, setNotifications] = useState(true)
  const navigate = useNavigate()

  async function save() {
    if (!user) return
    await upsertSettings(user.uid, "default", {
      currency: "BRL",
      locale: "pt-BR",
      defaultAccountId: defaultAccountName,
      notificationPreferences: { enabled: notifications },
      ownerUid: user.uid
    })
    navigate("/dashboard")
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Bem-vinda</h1>
      <div className="space-y-2">
        <label className="block text-lg">Conta padrão</label>
        <input className="w-full rounded border p-3 text-lg" placeholder="Conta padrão" value={defaultAccountName} onChange={e => setDefaultAccountName(e.target.value)} />
      </div>
      <div className="flex items-center gap-3">
        <input id="notif" type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} />
        <label htmlFor="notif" className="text-lg">Ativar notificações</label>
      </div>
      <button onClick={save} className="bg-primary text-white p-3 rounded text-lg">Continuar</button>
    </div>
  )
}
