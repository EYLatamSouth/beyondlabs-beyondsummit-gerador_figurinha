import { useState } from 'react'

interface AdminLoginProps {
  onLogin: (key: string) => void
  error?: string
}

export function AdminLogin({ onLogin, error }: AdminLoginProps) {
  const [key, setKey] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (key.trim()) {
      onLogin(key.trim())
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-extrabold text-[#111111] uppercase tracking-wide">
            Painel Admin
          </h1>
          <p className="font-display text-sm font-bold text-[#1A5C2A] uppercase tracking-widest mt-1">
            Beyond Summit 2026
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="admin-key"
              className="block text-xs font-semibold font-body uppercase tracking-wider text-[#374151] mb-1.5"
            >
              Senha de acesso
            </label>
            <input
              id="admin-key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Digite a chave de acesso"
              autoFocus
              className="w-full px-4 py-3 rounded-[10px] border border-[#D1D5DB] bg-white font-body text-base text-[#111111] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1A5C2A] focus:ring-2 focus:ring-[rgba(26,92,42,0.1)] transition-all duration-150"
            />
          </div>

          {error && (
            <p className="text-sm font-body text-[#EF4444] flex items-center gap-1.5">
              <span>⚠️</span>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full py-3 px-8 rounded-[8px] font-display font-bold text-base tracking-widest uppercase text-white bg-[#1A5C2A] hover:bg-[#3D9A52] disabled:bg-[#9CA3AF] disabled:cursor-not-allowed transition-all duration-200"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
