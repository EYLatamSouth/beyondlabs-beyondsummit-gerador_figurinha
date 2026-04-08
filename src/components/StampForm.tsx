import { Download, Share2, RotateCcw } from 'lucide-react'
import type { StampData } from '@/types/stamp'
import { CountrySelect } from '@/components/CountrySelect'

interface StampFormProps {
  value: StampData
  onChange: (data: StampData) => void
  onDownload: () => void
  onShare?: () => void
  onReset?: () => void
  isDownloadEnabled: boolean
}

interface FieldLabelProps {
  htmlFor: string
  children: React.ReactNode
}

function FieldLabel({ htmlFor, children }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold font-body uppercase tracking-wider text-[#374151] mb-1.5"
    >
      {children}
      <span className="text-[#EF4444] ml-0.5">*</span>
    </label>
  )
}

const inputBase = [
  'w-full px-4 py-3 rounded-[10px] border border-[#D1D5DB] bg-white',
  'font-body text-base text-[#111111] placeholder:text-[#9CA3AF]',
  'focus:outline-none focus:border-[#1A5C2A] focus:ring-2 focus:ring-[rgba(26,92,42,0.1)]',
  'transition-all duration-150',
].join(' ')

export function StampForm({
  value,
  onChange,
  onDownload,
  onShare,
  onReset,
  isDownloadEnabled,
}: StampFormProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="mb-1">
        <h2 className="font-display text-2xl font-bold text-[#111111] tracking-wide uppercase leading-tight">
          Preencha seus dados
        </h2>
        <div className="mt-1.5 flex gap-1 items-center">
          <span className="h-[3px] w-8 rounded-full bg-[#1A5C2A]" />
          <span className="h-[3px] w-3 rounded-full bg-[#C9A84C]" />
          <span className="h-[3px] w-1.5 rounded-full bg-[#3D9A52]" />
        </div>
      </div>

      {/* Nome */}
      <div>
        <FieldLabel htmlFor="stamp-name">Nome</FieldLabel>
        <input
          id="stamp-name"
          type="text"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          placeholder="Seu nome completo"
          className={inputBase}
        />
      </div>

      {/* Cargo */}
      <div>
        <FieldLabel htmlFor="stamp-role">Cargo</FieldLabel>
        <input
          id="stamp-role"
          type="text"
          value={value.role}
          onChange={(e) => onChange({ ...value, role: e.target.value })}
          placeholder="Ex: Senior Manager"
          className={inputBase}
        />
      </div>

      {/* Área */}
      <div>
        <FieldLabel htmlFor="stamp-area">Área</FieldLabel>
        <input
          id="stamp-area"
          type="text"
          value={value.area}
          onChange={(e) => onChange({ ...value, area: e.target.value })}
          placeholder="Ex: Technology Consulting"
          className={inputBase}
        />
      </div>

      {/* Email */}
      <div>
        <FieldLabel htmlFor="stamp-email">Email</FieldLabel>
        <input
          id="stamp-email"
          type="email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          placeholder="seu.email@ey.com"
          className={inputBase}
        />
        <p className="mt-1.5 flex items-start gap-1.5 text-[13px] font-body text-[#6B7280] leading-snug">
          <span className="shrink-0 mt-px">ℹ️</span>
          Seu email será usado apenas para fins internos de mensuração do evento
        </p>
      </div>

      {/* País */}
      <div>
        <FieldLabel htmlFor="stamp-country">País</FieldLabel>
        <CountrySelect
          value={value.countryCode}
          onChange={(code) => onChange({ ...value, countryCode: code })}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-[#E5E7EB]" />

      {/* Actions */}
      <div className="flex flex-col gap-2.5">
        {/* Primary CTA */}
        <button
          type="button"
          onClick={onDownload}
          disabled={!isDownloadEnabled}
          className={[
            'w-full flex items-center justify-center gap-2.5 py-4 px-8 rounded-[8px]',
            'font-display font-bold text-xl tracking-widest uppercase text-white',
            'transition-all duration-200',
            isDownloadEnabled
              ? 'bg-[#1A5C2A] hover:bg-[#3D9A52] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(26,92,42,0.35)] cursor-pointer'
              : 'bg-[#9CA3AF] cursor-not-allowed opacity-60',
          ].join(' ')}
        >
          <Download size={20} strokeWidth={2.5} />
          Baixar Figurinha
        </button>

        {/* Secondary row */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onShare?.()}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-[8px] border-2 border-[#1A5C2A] text-[#1A5C2A] font-display font-bold text-sm tracking-wider uppercase hover:bg-[#F0FDF4] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(26,92,42,0.4)]"
          >
            <Share2 size={14} strokeWidth={2.5} />
            LinkedIn
          </button>
          <button
            type="button"
            onClick={() => onReset?.()}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-[8px] text-[#374151] font-body text-sm font-medium hover:bg-[#F5F5F5] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(26,92,42,0.2)]"
          >
            <RotateCcw size={14} />
            Nova foto
          </button>
        </div>
      </div>
    </div>
  )
}
