import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Locale, LocaleKey } from './types'
import { ptBR } from './pt-BR'
import { es } from './es'
import { en } from './en'

const LOCALES: Record<LocaleKey, Locale> = { 'pt-BR': ptBR, es, en }

interface LocaleContextValue {
  lang: LocaleKey
  locale: Locale
  setLang: (lang: LocaleKey) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LocaleKey>('pt-BR')

  return (
    <LocaleContext.Provider value={{ lang, locale: LOCALES[lang], setLang }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}
