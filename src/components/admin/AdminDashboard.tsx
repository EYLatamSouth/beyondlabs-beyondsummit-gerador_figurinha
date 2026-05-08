import { useState, useEffect, useCallback } from 'react'
import { ParticipantTable } from '@/components/admin/ParticipantTable'
import { CapturedEmailsTable } from '@/components/admin/CapturedEmailsTable'

interface CountryCount {
  code: string
  name: string
  count: number
}

interface Participant {
  nome: string
  email: string
  pais: string
  timestamp: string
}

interface CapturedEmail {
  email: string
  timestamp: string
}

interface MetricsData {
  total: number
  uniqueEmails: number
  byCountry: CountryCount[]
  participants: Participant[]
  capturedEmails: CapturedEmail[]
}

interface AdminDashboardProps {
  adminKey: string
  onLogout: () => void
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export function AdminDashboard({ adminKey, onLogout }: AdminDashboardProps) {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/metrics`, {
        headers: { 'x-admin-key': adminKey },
      })
      if (res.status === 401) {
        onLogout()
        return
      }
      if (!res.ok) {
        setError('Erro ao carregar dados. Tente novamente.')
        return
      }
      const data = (await res.json()) as MetricsData
      setMetrics(data)
    } catch {
      setError('Erro de conexão. Verifique sua internet.')
    } finally {
      setLoading(false)
    }
  }, [adminKey, onLogout])

  useEffect(() => {
    void fetchMetrics()
  }, [fetchMetrics])

  const maxCount = metrics?.byCountry[0]?.count ?? 1

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#111111] uppercase tracking-wide leading-none">
            Painel Admin
          </h1>
          <p className="font-display text-sm font-bold text-[#1A5C2A] uppercase tracking-widest mt-0.5">
            Beyond Summit Innovation Cup 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void fetchMetrics()}
            disabled={loading}
            className="px-4 py-2 rounded-[8px] border border-[#D1D5DB] text-[#374151] font-body text-sm font-medium hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          >
            {loading ? '⏳ Atualizando…' : '↻ Atualizar'}
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 rounded-[8px] text-[#374151] font-body text-sm font-medium hover:bg-[#F5F5F5] transition-all duration-150"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 lg:p-10 flex flex-col gap-8">
        {error && (
          <div className="p-4 rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] font-body text-sm flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {loading && !metrics && (
          <div className="flex items-center justify-center py-16 text-[#9CA3AF] font-body">
            Carregando dados…
          </div>
        )}

        {metrics && (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB]">
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Total de Figurinhas Geradas
                </p>
                <p className="font-display text-5xl font-extrabold text-[#1A5C2A] mt-1">
                  {metrics.total.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="p-6 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB]">
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  E-mails Únicos Capturados
                </p>
                <p className="font-display text-5xl font-extrabold text-[#1A5C2A] mt-1">
                  {metrics.uniqueEmails.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="p-6 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB]">
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Países Representados
                </p>
                <p className="font-display text-5xl font-extrabold text-[#C9A84C] mt-1">
                  {metrics.byCountry.length}
                </p>
              </div>
            </div>

            {/* Country distribution */}
            {metrics.byCountry.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="font-display text-lg font-bold text-[#111111] uppercase tracking-wide">
                  Distribuição por País
                </h2>
                <div className="flex flex-col gap-2">
                  {metrics.byCountry.map((c) => (
                    <div key={c.code} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 font-body text-sm text-[#374151] truncate">
                        {c.name}
                      </span>
                      <div className="flex-1 bg-[#E5E7EB] rounded-full h-5 overflow-hidden">
                        <div
                          className="h-full bg-[#1A5C2A] rounded-full transition-all duration-500"
                          style={{ width: `${Math.round((c.count / maxCount) * 100)}%` }}
                        />
                      </div>
                      <span className="w-10 shrink-0 font-body text-sm font-semibold text-[#374151] text-right">
                        {c.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Participants table */}
            <ParticipantTable participants={metrics.participants} />

            {/* Captured emails table */}
            <CapturedEmailsTable emails={metrics.capturedEmails ?? []} />
          </>
        )}
      </div>
    </div>
  )
}
