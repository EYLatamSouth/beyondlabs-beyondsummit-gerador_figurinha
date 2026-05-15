import { Crown, Scale, Target, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { QuizAnswers, QuizLetter, QuizResultData } from '@/types/quiz'
import type { LocaleQuizResultText } from '@/i18n/types'

/** Visual/structural data per quiz result letter (language-independent). */
interface QuizResultStatic {
  letter: QuizLetter
  icon: LucideIcon
  color: string
  colorBg: string
}

const QUIZ_RESULT_STATIC: Record<QuizLetter, QuizResultStatic> = {
  A: { letter: 'A', icon: Target, color: '#C9A84C', colorBg: '#FBF5E6' },
  B: { letter: 'B', icon: Zap,    color: '#E8365D', colorBg: '#FEF0F3' },
  C: { letter: 'C', icon: Scale,  color: '#4BBFDB', colorBg: '#EFF9FC' },
  D: { letter: 'D', icon: Crown,  color: '#6B3FA0', colorBg: '#F4EFF9' },
}

/**
 * Merges locale-specific text with the static visual data to produce full
 * QuizResultData objects ready for use in components.
 */
export function buildQuizResults(
  localeResults: Record<QuizLetter, LocaleQuizResultText>,
): Record<QuizLetter, QuizResultData> {
  return {
    A: { ...QUIZ_RESULT_STATIC.A, ...localeResults.A },
    B: { ...QUIZ_RESULT_STATIC.B, ...localeResults.B },
    C: { ...QUIZ_RESULT_STATIC.C, ...localeResults.C },
    D: { ...QUIZ_RESULT_STATIC.D, ...localeResults.D },
  }
}

/**
 * Counts how many times each letter was chosen.
 * Returns the winning letter, or null if there is a tie.
 */
export function calculateResult(answers: QuizAnswers): QuizLetter | null {
  const counts: Record<QuizLetter, number> = { A: 0, B: 0, C: 0, D: 0 }
  for (const letter of Object.values(answers)) {
    counts[letter]++
  }

  const max = Math.max(...Object.values(counts))
  const winners = (Object.keys(counts) as QuizLetter[]).filter((l) => counts[l] === max)

  if (winners.length === 1) return winners[0]
  return null // tie
}
