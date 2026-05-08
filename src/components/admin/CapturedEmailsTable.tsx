interface CapturedEmail {
  email: string
  timestamp: string
}

interface CapturedEmailsTableProps {
  emails: CapturedEmail[]
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

function exportCSV(emails: CapturedEmail[]): void {
  const header = 'Email,Horário\n'
  const rows = emails
    .map((e) => `"${e.email}","${formatTimestamp(e.timestamp)}"`)
    .join('\n')
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `emails_capturados_beyondsummit2026_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function CapturedEmailsTable({ emails }: CapturedEmailsTableProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-[#111111] uppercase tracking-wide">
          E-mails Capturados
        </h3>
        <button
          type="button"
          onClick={() => exportCSV(emails)}
          disabled={emails.length === 0}
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
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#374151]">
                Horário de Captura
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {emails.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-[#9CA3AF]">
                  Nenhum e-mail capturado ainda.
                </td>
              </tr>
            ) : (
              emails.map((e, i) => (
                <tr key={i} className="hover:bg-[#F9FAFB] transition-colors duration-100">
                  <td className="px-4 py-3 text-[#374151]">{e.email}</td>
                  <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                    {formatTimestamp(e.timestamp)}
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
