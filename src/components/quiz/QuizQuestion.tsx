import type { QuizQuestion as QuizQuestionType, QuizLetter } from '@/types/quiz'
import { useLocale } from '@/i18n'

interface QuizQuestionProps {
  question: QuizQuestionType
  totalQuestions: number
  onAnswer: (letter: QuizLetter) => void
}

export function QuizQuestion({ question, totalQuestions, onAnswer }: QuizQuestionProps) {
  const { locale } = useLocale()
  const isTiebreaker = question.id > totalQuestions

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-slide-up">
      {/* Progress bar */}
      {!isTiebreaker && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold font-body uppercase tracking-wider text-[#6B7280]">
              {locale.quiz.progressLabel(question.id, totalQuestions)}
            </span>
            <span className="text-xs font-semibold font-body text-[#1A5C2A]">
              {Math.round((question.id / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-[#1A5C2A] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(question.id / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Question */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 mb-4">
        <p className="font-display font-bold text-xl md:text-2xl text-[#111111] leading-snug">
          {question.text}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.letter}
            type="button"
            onClick={() => onAnswer(option.letter)}
            className="group w-full text-left flex items-start gap-4 rounded-2xl border-2 border-[#E5E7EB] bg-white px-5 py-4 transition-all duration-150 hover:border-[#1A5C2A] hover:bg-[#F0FDF4] hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A5C2A] focus-visible:ring-offset-2"
          >
            <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#F0FDF4] border-2 border-[#D1D5DB] group-hover:border-[#1A5C2A] group-hover:bg-[#1A5C2A] transition-all duration-150 font-display font-bold text-sm text-[#1A5C2A] group-hover:text-white">
              {option.letter}
            </span>
            <span className="font-body text-[#374151] text-sm md:text-base leading-snug pt-0.5">
              {option.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
