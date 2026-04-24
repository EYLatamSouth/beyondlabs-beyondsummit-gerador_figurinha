import { Download, Share2, RotateCcw, Globe, Check, Loader2 } from 'lucide-react'
import type { StampData } from '@/types/stamp'
import { CountrySelect } from '@/components/CountrySelect'

type MuralUploadStatus = 'idle' | 'uploading' | 'done' | 'error'

interface StampFormProps {
  value: StampData
  onChange: (data: StampData) => void
  onDownload: () => void
  onShare?: () => void
  onReset?: () => void
  isDownloadEnabled: boolean
  onSendToMural?: () => void
  muralUploadStatus?: MuralUploadStatus
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
  onSendToMural,
  muralUploadStatus = 'idle',
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
        {/* Primary CTAs */}
        <div className={onSendToMural ? 'flex gap-2' : ''}>
          {/* Download button */}
          <button
            type="button"
            onClick={onDownload}
            disabled={!isDownloadEnabled}
            className={[
              'flex items-center justify-center gap-2 py-4 rounded-[8px]',
              onSendToMural ? 'flex-1 px-3 text-sm' : 'w-full px-8 text-xl',
              'font-display font-bold tracking-widest uppercase text-white',
              'transition-all duration-200',
              isDownloadEnabled
                ? 'bg-[#1A5C2A] hover:bg-[#3D9A52] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(26,92,42,0.35)] cursor-pointer'
                : 'bg-[#9CA3AF] cursor-not-allowed opacity-60',
            ].join(' ')}
          >
            <Download size={onSendToMural ? 16 : 20} strokeWidth={2.5} />
            Baixar Figurinha
          </button>

          {/* Send to mural button */}
          {onSendToMural && (() => {
            const isDisabled = !isDownloadEnabled || muralUploadStatus === 'uploading' || muralUploadStatus === 'done'
            return (
              <button
                type="button"
                onClick={isDisabled ? undefined : onSendToMural}
                disabled={isDisabled}
                className={[
                  'flex-1 flex items-center justify-center gap-2 py-4 px-3 rounded-[8px]',
                  'font-display font-bold text-sm tracking-widest uppercase',
                  'border-2 transition-all duration-200 whitespace-nowrap',
                  muralUploadStatus === 'done'
                    ? 'border-[#1A5C2A] text-[#1A5C2A] bg-[#F0FDF4] cursor-default'
                    : muralUploadStatus === 'uploading' || !isDownloadEnabled
                    ? 'border-[#9CA3AF] text-[#9CA3AF] cursor-not-allowed opacity-60'
                    : 'border-[#111111] text-[#111111] hover:bg-[#F5F5F5] cursor-pointer',
                ].join(' ')}
              >
                {muralUploadStatus === 'uploading' && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {muralUploadStatus === 'done' && <Check size={16} strokeWidth={2.5} />}
                {(muralUploadStatus === 'idle' || muralUploadStatus === 'error') && (
                  <Globe size={16} strokeWidth={2.5} />
                )}
                {muralUploadStatus === 'uploading'
                  ? 'Enviando...'
                  : muralUploadStatus === 'done'
                  ? 'No mural!'
                  : 'Enviar pro Mural'}
              </button>
            )
          })()}
        </div>

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
