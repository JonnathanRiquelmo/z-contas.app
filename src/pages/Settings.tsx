import { logout } from "../services/auth"
import { useNavigate } from "react-router-dom"
import { notify } from "../services/notification"

export default function Settings() {
  const navigate = useNavigate()
  async function onLogout() {
    await logout()
    navigate("/login")
  }
  async function testNotif() {
    await notify("Z-Contas", "Exemplo de notificação")
  }
  return (
    <div className="p-6 space-y-4 bg-neutral-900 text-neutral-100 min-h-full">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <div className="space-y-3">
        <button className="bg-neutral-800 text-neutral-100 p-3 rounded-2xl text-lg hover:brightness-110" onClick={testNotif}>Testar notificações</button>
        <button className="bg-rose-500 text-white p-3 rounded-2xl text-lg hover:brightness-110" onClick={onLogout}>Sair</button>
      </div>
    </div>
  )
}
