interface Participant {
  nome: string
  email: string
  pais: string
  timestamp: string
}

interface ParticipantTableProps {
  participants: Participant[]
}

function formatTimestamp(ts: string): string {
  try {
    return new Date(ts).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ts
  }
}

function exportCSV(participants: Participant[]): void {
  const header = 'Nome,Email,País,Horário\n'
  const rows = participants
    .map(
      (p) =>
        `"${p.nome.replace(/"/g, '""')}","${p.email}","${p.pais}","${formatTimestamp(p.timestamp)}"`,
    )
    .join('\n')
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `participants_beyondsummit2026_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function ParticipantTable({ participants }: ParticipantTableProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-[#111111] uppercase tracking-wide">
          Participantes
        </h3>
        <button
          type="button"
          onClick={() => exportCSV(participants)}
          disabled={participants.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] border border-[#1A5C2A] text-[#1A5C2A] font-body text-sm font-medium hover:bg-[#F0FDF4] disabled:border-[#D1D5DB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed transition-all duration-150"
        >
          ⬇ Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-[10px] border border-[#E5E7EB]">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#374151]">
                Nome
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#374151]">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#374151]">
                País
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#374151]">
                Horário
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {participants.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[#9CA3AF]">
                  Nenhum participante registrado ainda.
                </td>
              </tr>
            ) : (
              participants.map((p, i) => (
                <tr key={i} className="hover:bg-[#F9FAFB] transition-colors duration-100">
                  <td className="px-4 py-3 text-[#111111] font-medium whitespace-nowrap">{p.nome}</td>
                  <td className="px-4 py-3 text-[#374151]">{p.email}</td>
                  <td className="px-4 py-3 text-[#374151] whitespace-nowrap">{p.pais}</td>
                  <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                    {formatTimestamp(p.timestamp)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
