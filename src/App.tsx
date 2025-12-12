import { Route, Routes, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"
import Onboarding from "./pages/Onboarding"
import { useAuthState } from "./services/auth"
import { useOnlineStatus } from "./hooks/useOnlineStatus"
import { useEffect } from "react"
import { processAll } from "./services/offlineQueue"

export default function App() {
  const { user, initialized } = useAuthState()
  const online = useOnlineStatus()
  useEffect(() => {
    if (online) processAll()
  }, [online])
  if (!initialized) return <div className="p-6 text-xl">Carregando...</div>
  return (
    <>
      {!online && <div className="bg-yellow-300 text-black text-center p-2 text-lg">Offline</div>}
      <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/login" replace />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/transactions" element={user ? <Transactions /> : <Navigate to="/login" replace />} />
      <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" replace />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </>
  )
}
