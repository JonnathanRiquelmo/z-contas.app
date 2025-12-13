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
    } catch (err: any) {
      console.error("Login error:", err)
      const msg = err.code ? `Erro (${err.code}): ${err.message}` : "Falha no login. Verifique conexão e credenciais."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Entrar</h1>
        <button
          type="button"
          className={`w-full ${canInstall ? "bg-sky-600" : "bg-neutral-700"} text-white p-3 rounded text-lg`}
          onClick={install}
          disabled={!canInstall}
        >
          Instalar app
        </button>
        {!canInstall && (
          <div className="text-center text-neutral-500 text-sm">
            A instalação ficará disponível quando o navegador oferecer o atalho.
          </div>
        )}
        <input
          type="email"
          className="w-full rounded border border-neutral-700 bg-neutral-900 p-3 text-lg"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full rounded border border-neutral-700 bg-neutral-900 p-3 text-lg"
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
