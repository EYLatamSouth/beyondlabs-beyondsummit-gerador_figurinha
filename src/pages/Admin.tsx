import { useState } from 'react'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default function Admin() {
  const [adminKey, setAdminKey] = useState<string | null>(null)
  const [loginError, setLoginError] = useState<string | undefined>()

  function handleLogin(key: string) {
    setLoginError(undefined)
    setAdminKey(key)
  }

  function handleLogout() {
    setAdminKey(null)
    setLoginError('Senha incorreta. Tente novamente.')
  }

  if (!adminKey) {
    return <AdminLogin onLogin={handleLogin} error={loginError} />
  }

  return <AdminDashboard adminKey={adminKey} onLogout={handleLogout} />
}
