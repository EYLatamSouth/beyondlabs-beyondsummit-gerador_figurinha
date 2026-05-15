import { Download, RotateCcw } from 'lucide-react'
import type { StampData } from '@/types/stamp'
import type { QuizResultData } from '@/types/quiz'
import { CountrySelect } from '@/components/CountrySelect'
import { useLocale } from '@/i18n'

interface StampFormProps {
  value: StampData
  onChange: (data: StampData) => void
  onDownload: () => void
  onReset?: () => void
  isDownloadEnabled: boolean
  quizResult: QuizResultData | null
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
  onReset,
  isDownloadEnabled,
  quizResult,
}: StampFormProps) {
  const { locale } = useLocale()

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="mb-1">
        <h2 className="font-display text-2xl font-bold text-[#111111] tracking-wide uppercase leading-tight">
          {locale.editor.formTitle}
        </h2>
        <div className="mt-1.5 flex gap-1 items-center">
          <span className="h-[3px] w-8 rounded-full bg-[#1A5C2A]" />
          <span className="h-[3px] w-3 rounded-full bg-[#C9A84C]" />
          <span className="h-[3px] w-1.5 rounded-full bg-[#3D9A52]" />
        </div>
      </div>

      {/* Quiz result badge (read-only) */}
      {quizResult && (
        <div
          className="rounded-2xl border-2 p-4 flex items-center gap-3"
          style={{ borderColor: quizResult.color, backgroundColor: quizResult.colorBg }}
        >
          <div
            className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ backgroundColor: quizResult.color }}
          >
            <quizResult.icon size={20} color="#FFFFFF" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="font-display font-extrabold text-base uppercase tracking-wide text-[#111111] leading-tight">
              {quizResult.title}
            </p>
            <p className="font-body text-xs font-semibold mt-0.5" style={{ color: quizResult.color }}>
              {quizResult.area}
            </p>
          </div>
          <span
            className="ml-auto shrink-0 text-[10px] font-bold font-body uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ backgroundColor: quizResult.color, color: '#FFFFFF' }}
          >
            {locale.editor.yourResult}
          </span>
        </div>
      )}

      {/* Nome */}
      <div>
        <FieldLabel htmlFor="stamp-name">{locale.editor.nameLabel}</FieldLabel>
        <input
          id="stamp-name"
          type="text"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          placeholder={locale.editor.namePlaceholder}
          className={inputBase}
        />
      </div>

      {/* País */}
      <div>
        <FieldLabel htmlFor="stamp-country">{locale.editor.countryLabel}</FieldLabel>
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
        <div>
          {/* Download button */}
          <button
            type="button"
            onClick={onDownload}
            disabled={!isDownloadEnabled}
            className={[
              'flex items-center justify-center gap-2 py-4 rounded-[8px] w-full px-8 text-xl',
              'font-display font-bold tracking-widest uppercase text-white',
              'transition-all duration-200',
              isDownloadEnabled
                ? 'bg-[#1A5C2A] hover:bg-[#3D9A52] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(26,92,42,0.35)] cursor-pointer'
                : 'bg-[#9CA3AF] cursor-not-allowed opacity-60',
            ].join(' ')}
          >
            <Download size={20} strokeWidth={2.5} />
            {locale.editor.downloadButton}
          </button>
        </div>

        {/* Secondary row */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => onReset?.()}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-[8px] text-[#374151] font-body text-sm font-medium hover:bg-[#F5F5F5] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(26,92,42,0.2)]"
          >
            <RotateCcw size={14} />
            {locale.editor.resetButton}
          </button>
        </div>
      </div>
    </div>
  )
}
