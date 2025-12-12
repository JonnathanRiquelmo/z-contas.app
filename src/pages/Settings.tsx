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
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <button className="bg-primary text-white p-3 rounded text-lg" onClick={testNotif}>Testar notificações</button>
      <button className="bg-red-600 text-white p-3 rounded text-lg" onClick={onLogout}>Sair</button>
    </div>
  )
}
