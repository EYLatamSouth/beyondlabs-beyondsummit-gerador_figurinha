import type { LocaleKey } from '@/i18n/types'

interface Language {
  key: LocaleKey
  flag: string
  label: string
  nativeLabel: string
}

const LANGUAGES: Language[] = [
  { key: 'pt-BR', flag: '🇧🇷', label: 'Português', nativeLabel: 'Português (Brasil)' },
  { key: 'es',    flag: '🇪🇸', label: 'Español',   nativeLabel: 'Español' },
  { key: 'en',    flag: '🇺🇸', label: 'English',   nativeLabel: 'English' },
]

interface LanguagePickerProps {
  onSelect: (lang: LocaleKey) => void
}

export function LanguagePicker({ onSelect }: LanguagePickerProps) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 animate-fade-slide-up">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src="/assets/logo-beyondSummit_fonte_preta.png"
            alt="Beyond Summit Innovation Cup"
            className="mx-auto h-16 md:h-20 w-auto object-contain"
          />
          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-[#D1D5DB]" />
            <span className="text-xs font-bold text-[#E0C060] tracking-[0.3em] uppercase">2026</span>
            <div className="h-px flex-1 bg-[#D1D5DB]" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#111111] uppercase tracking-wide leading-tight">
            Choose your language
          </h1>
          <p className="mt-1 font-body text-sm text-[#6B7280]">
            Escolha seu idioma · Elige tu idioma
          </p>
        </div>

        {/* Language cards */}
        <div className="flex flex-col gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.key}
              type="button"
              onClick={() => onSelect(lang.key)}
              className="group flex items-center gap-5 w-full rounded-2xl border-2 border-[#E5E7EB] bg-white px-6 py-5 transition-all duration-150 hover:border-[#1A5C2A] hover:bg-[#F0FDF4] hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A5C2A] focus-visible:ring-offset-2"
            >
              <span className="text-4xl leading-none select-none">{lang.flag}</span>
              <div className="text-left">
                <p className="font-display font-bold text-xl uppercase tracking-wide text-[#111111] group-hover:text-[#1A5C2A] transition-colors duration-150">
                  {lang.label}
                </p>
                <p className="font-body text-sm text-[#6B7280]">{lang.nativeLabel}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
