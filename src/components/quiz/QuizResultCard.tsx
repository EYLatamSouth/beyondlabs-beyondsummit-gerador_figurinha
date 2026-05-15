import type { QuizResultData } from '@/types/quiz'
import { Trophy } from 'lucide-react'
import { UploadZone } from '@/components/UploadZone'
import { useLocale } from '@/i18n'

interface QuizResultCardProps {
  result: QuizResultData
  onFileSelect: (file: File) => void
  selectedFile: File | null
}

export function QuizResultCard({ result, onFileSelect, selectedFile }: QuizResultCardProps) {
  const { locale } = useLocale()

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-slide-up">
      {/* Header label */}
      <div className="text-center mb-4">
        <span
          className="inline-block text-xs font-bold font-body uppercase tracking-[0.2em] px-3 py-1 rounded-full"
          style={{ backgroundColor: result.colorBg, color: result.color }}
        >
          <Trophy size={12} className="inline-block mr-1" />
          {locale.quiz.resultBadge}
        </span>
      </div>

      {/* Result card */}
      <div
        className="rounded-3xl border-2 p-6 mb-6 shadow-md"
        style={{ borderColor: result.color, backgroundColor: result.colorBg }}
      >
        {/* Emoji + title */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl shadow-sm"
            style={{ backgroundColor: result.color }}
          >
            <result.icon size={32} color="#FFFFFF" strokeWidth={2} />
          </div>
          <div>
            <p className="font-display font-extrabold text-2xl md:text-3xl leading-tight text-[#111111] uppercase tracking-wide">
              {result.title}
            </p>
            <p
              className="font-body text-sm font-semibold mt-0.5"
              style={{ color: result.color }}
            >
              {result.area}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="font-body text-[#374151] text-sm md:text-base leading-relaxed mb-4">
          {result.description}
        </p>

        {/* Superpower badge */}
        <div className="flex items-start gap-2">
          <span className="shrink-0 text-base">⚡</span>
          <div>
            <span className="font-body text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              {locale.quiz.superpowerLabel}{' '}
            </span>
            <span
              className="font-body text-sm font-semibold"
              style={{ color: result.color }}
            >
              {result.superpower}
            </span>
          </div>
        </div>
      </div>

      {/* Upload section */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5">
        <div className="text-center mb-4">
          <p className="font-display font-bold text-lg text-[#111111] uppercase tracking-wide">
            {locale.quiz.createStampTitle}
          </p>
          <p className="font-body text-sm text-[#6B7280] mt-1">
            {locale.quiz.createStampSubtitle}
          </p>
        </div>
        <UploadZone onFileSelect={onFileSelect} selectedFile={selectedFile} />
        <p className="mt-3 text-center text-xs font-body text-[#9CA3AF]">
          {locale.quiz.uploadPhotoHint}
        </p>
      </div>
    </div>
  )
}
