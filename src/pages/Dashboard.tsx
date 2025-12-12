import { Link, useNavigate } from "react-router-dom"
import { useAuthState } from "../services/auth"
import { logout } from "../services/auth"

export default function Dashboard() {
  const { user } = useAuthState()
  const navigate = useNavigate()
  async function onLogout() {
    await logout()
    navigate("/login")
  }
  function goBack() {
    navigate(-1)
  }
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button className="bg-gray-200 px-3 py-2 rounded text-lg" onClick={goBack}>Voltar</button>
        <button className="bg-red-600 text-white px-3 py-2 rounded text-lg" onClick={onLogout}>Sair</button>
      </div>
      <h1 className="text-2xl font-bold">Resumo</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <div className="text-lg">Saldo total</div>
          <div className="text-2xl font-bold">R$ 0,00</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-lg">Período atual</div>
          <div className="text-2xl font-bold">Entradas 0 • Saídas 0</div>
        </div>
      </div>
      <Link to="/transactions" className="block bg-accent text-white text-center p-4 rounded text-xl">
        Registrar
      </Link>
      <div className="flex gap-3">
        <Link to="/reports" className="flex-1 bg-primary text-white text-center p-3 rounded text-lg">Relatórios</Link>
        <Link to="/settings" className="flex-1 bg-gray-800 text-white text-center p-3 rounded text-lg">Configurações</Link>
      </div>
      <div className="text-sm">Usuária: {user?.email}</div>
    </div>
  )
}
