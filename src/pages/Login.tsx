import { useState } from "react"
import { login } from "../services/auth"
import { Link } from "react-router-dom"
import { useInstallPrompt } from "../hooks/useInstallPrompt"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { canInstall, install } = useInstallPrompt()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login(email, password)
    } catch {
      setError("Falha no login. Verifique e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Entrar</h1>
        {canInstall && (
          <button type="button" className="w-full bg-accent text-white p-3 rounded text-lg" onClick={install}>
            Instalar app
          </button>
        )}
        <input
          type="email"
          className="w-full rounded border p-3 text-lg"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full rounded border p-3 text-lg"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="text-red-600 text-lg">{error}</div>}
        <button type="submit" disabled={loading} className="w-full bg-primary text-white p-3 rounded text-lg">
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <div className="text-center">
          <Link to="/onboarding" className="text-primary underline">
            Ajuda para começar
          </Link>
        </div>
      </form>
    </div>
  )
}
