import type { LucideIcon } from 'lucide-react'

export type QuizLetter = 'A' | 'B' | 'C' | 'D'

export interface QuizOption {
  letter: QuizLetter
  text: string
}

export interface QuizQuestion {
  id: number
  text: string
  options: QuizOption[]
}

export interface QuizResultData {
  letter: QuizLetter
  /** Short title shown on the card, e.g. "Camisa 10 | Meia Armador(a)" */
  title: string
  /** Full label including area, e.g. "Camisa 10 | Meia Armador(a) — Innovation Core Methods" */
  fullLabel: string
  area: string
  icon: LucideIcon
  description: string
  superpower: string
  /** Tailwind-compatible hex color for this result */
  color: string
  /** Lighter background shade for the card */
  colorBg: string
}

/** Map of question id → chosen letter */
export type QuizAnswers = Record<number, QuizLetter>
