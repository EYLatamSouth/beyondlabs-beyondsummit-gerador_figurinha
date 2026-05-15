import type { QuizLetter } from '@/types/quiz'

export type LocaleKey = 'pt-BR' | 'es' | 'en'

export interface LocaleQuizOption {
  letter: QuizLetter
  text: string
}

export interface LocaleQuizQuestion {
  id: number
  text: string
  options: LocaleQuizOption[]
}

export interface LocaleQuizResultText {
  title: string
  fullLabel: string
  area: string
  description: string
  superpower: string
}

export interface Locale {
  languagePicker: {
    title: string
    subtitle: string
  }

  landing: {
    title: string
    subtitle: string
    description: string
    learnMoreLabel: string
    emailLabel: string
    emailPlaceholder: string
    emailHint: string
    startButton: string
    quizHint: string
  }

  quiz: {
    progressLabel: (current: number, total: number) => string
    tiebreakerBadge: string
    questions: LocaleQuizQuestion[]
    tiebreaker: LocaleQuizQuestion
    results: Record<QuizLetter, LocaleQuizResultText>
    resultBadge: string
    superpowerLabel: string
    createStampTitle: string
    createStampSubtitle: string
    uploadPhotoHint: string
  }

  processing: {
    title: string
    messages: [string, string, string]
    hint: string
  }

  photoAdjust: {
    title: string
    hint: string
    dragHint: string
    confirmButton: string
    replacePhoto: string
    skipButton: string
  }

  editor: {
    formTitle: string
    yourResult: string
    nameLabel: string
    namePlaceholder: string
    canvasNamePlaceholder: string
    countryLabel: string
    downloadButton: string
    resetButton: string
  }

  uploadZone: {
    dragHere: string
    dropHere: string
    clickToSelect: string
    formatHint: string
    changePhoto: string
    previewAlt: string
    errorInvalidFormat: string
    errorTooBig: string
  }

  countrySelect: {
    seeMore: string
    modalTitle: string
    modalSubtitle: string
    searchPlaceholder: string
    noResults: string
  }

  /** Country names keyed by ISO alpha-2 code, e.g. { br: 'Brasil', ar: 'Argentina' } */
  countries: Record<string, string>

  toasts: {
    emailRequired: string
    rareStamp: string
    stampDownloaded: string
    bgRemovalError: string
  }
}
