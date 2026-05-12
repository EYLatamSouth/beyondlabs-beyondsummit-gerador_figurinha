import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { StampForm } from '@/components/StampForm'
import { StampCanvas } from '@/components/StampCanvas'
import { PhotoAdjustEditor } from '@/components/PhotoAdjustEditor'
import { Header } from '@/components/Header'
import { DecorativeCorners } from '@/components/DecorativeCorners'
import { AppBackground } from '@/components/AppBackground'
import { QuizQuestion } from '@/components/quiz/QuizQuestion'
import { QuizResultCard } from '@/components/quiz/QuizResultCard'
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval'
import { useStampCanvas } from '@/hooks/useStampCanvas'
import { registerParticipant } from '@/lib/analytics'
import { getCountryByCode } from '@/lib/countries'
import { QUIZ_QUESTIONS, TIEBREAKER_QUESTION, QUIZ_RESULTS, calculateResult } from '@/lib/quiz'
import type { StampData, PhotoTransform } from '@/types/stamp'
import { DEFAULT_PHOTO_TRANSFORM } from '@/types/stamp'
import type { QuizAnswers, QuizLetter, QuizResultData } from '@/types/quiz'


const EMPTY_STAMP: StampData = {
  name: '',
  role: '',
  area: '',
  email: '',
  countryCode: '',
}


const LOADING_MESSAGES = [
  'Analisando sua foto...',
  'Removendo o fundo...',
  'Quase lá...',
]

function isStampComplete(data: StampData): boolean {
  return (
    data.name.trim() !== '' &&
    data.email.trim() !== '' &&
    data.countryCode !== ''
  )
}

export default function Home() {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [uploadEmail, setUploadEmail] = useState('')
  const [stampData, setStampData] = useState<StampData>(EMPTY_STAMP)
  const [msgIndex, setMsgIndex] = useState(0)
  const [photoTransform, setPhotoTransform] = useState<PhotoTransform>(DEFAULT_PHOTO_TRANSFORM)
  const [photoAdjusted, setPhotoAdjusted] = useState(false)
  const [forceRare, setForceRare] = useState(false)

  const replacePhotoInputRef = useRef<HTMLInputElement>(null)

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({})
  const [needsTiebreaker, setNeedsTiebreaker] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResultData | null>(null)

  const {
    status,
    processedUrl: processedPhotoUrl,
    processFile,
    reset,
  } = useBackgroundRemoval()

  const { canvasRef, isComposing, isRare, downloadPNG } = useStampCanvas(stampData, processedPhotoUrl, photoTransform, forceRare)

  const step =
    !quizStarted ? 'landing'
    : quizResult === null && !needsTiebreaker && quizQuestionIndex < QUIZ_QUESTIONS.length ? 'quiz'
    : quizResult === null && needsTiebreaker ? 'tiebreaker'
    : quizResult !== null && (!photoFile || status === 'idle') ? 'quiz-result'
    : status === 'processing' ? 'processing'
    : status === 'done' && !photoAdjusted ? 'photo-adjust'
    : 'editor'

  useEffect(() => {
    if (photoFile) {
      processFile(photoFile)
    }
  }, [photoFile]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (quizResult) {
      setStampData((prev) => ({
        ...prev,
        role: quizResult.title,
        area: quizResult.area,
      }))
    }
  }, [quizResult])

  useEffect(() => {
    if (status !== 'processing') return
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 1800)
    return () => clearInterval(id)
  }, [status])

  function handleReset(): void {
    setPhotoFile(null)
    setUploadEmail('')
    setStampData(EMPTY_STAMP)
    setPhotoTransform(DEFAULT_PHOTO_TRANSFORM)
    setPhotoAdjusted(false)
    setQuizStarted(false)
    setQuizQuestionIndex(0)
    setQuizAnswers({})
    setNeedsTiebreaker(false)
    setQuizResult(null)
    reset()
  }

  function handlePhotoAdjustConfirm(transform: PhotoTransform): void {
    setPhotoTransform(transform)
    setPhotoAdjusted(true)
  }

  function handlePhotoAdjustSkip(): void {
    setPhotoAdjusted(true)
  }

  function handleStartQuiz(): void {
    const prefix = uploadEmail.trim()
    if (!prefix || /\s/.test(prefix)) {
      toast.error('Informe seu email corporativo antes de começar o quiz.')
      return
    }
    const email = prefix + '.ey.com'
    setStampData((prev) => ({ ...prev, email }))
    setQuizStarted(true)
    // Fire-and-forget: register email as soon as the user starts the flow
    registerParticipant({
      email,
      timestamp: new Date().toISOString(),
      status: 'started',
      nome: '',
      pais: '',
      paisCode: '',
      cargo: '',
      area: '',
    })
  }

  function handleQuizAnswer(letter: QuizLetter): void {
    if (needsTiebreaker) {
      // Tiebreaker answer resolves the result directly
      setQuizResult(QUIZ_RESULTS[letter])
      setNeedsTiebreaker(false)
      fireQuizConfetti()
      return
    }

    const question = QUIZ_QUESTIONS[quizQuestionIndex]
    const updatedAnswers: QuizAnswers = { ...quizAnswers, [question.id]: letter }
    setQuizAnswers(updatedAnswers)

    const nextIndex = quizQuestionIndex + 1

    if (nextIndex < QUIZ_QUESTIONS.length) {
      setQuizQuestionIndex(nextIndex)
      return
    }

    // All 5 questions answered — calculate result
    const winner = calculateResult(updatedAnswers)
    if (winner) {
      setQuizResult(QUIZ_RESULTS[winner])
      fireQuizConfetti()
    } else {
      setNeedsTiebreaker(true)
    }
  }

  function fireQuizConfetti(): void {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#1A5C2A', '#3D9A52', '#C9A84C', '#F5C518', '#FFFFFF'],
      scalar: 1.0,
      gravity: 0.9,
      decay: 0.93,
    })
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 110,
        origin: { x: 0.15, y: 0.55 },
        colors: ['#C9A84C', '#F5C518', '#FFFFFF'],
        scalar: 0.85,
      })
      confetti({
        particleCount: 50,
        spread: 110,
        origin: { x: 0.85, y: 0.55 },
        colors: ['#C9A84C', '#F5C518', '#FFFFFF'],
        scalar: 0.85,
      })
    }, 250)
  }

  function handleFileSelect(file: File): void {
    setPhotoFile(file)
  }

  function handleReplacePhoto(): void {
    // Clear current file so the useEffect re-fires even if same file is selected again
    setPhotoFile(null)
    setPhotoAdjusted(false)
    replacePhotoInputRef.current?.click()
  }

  function handleReplaceFileSelected(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset value so the same file can be re-selected if needed
    e.target.value = ''
    setPhotoAdjusted(false)
    setPhotoTransform(DEFAULT_PHOTO_TRANSFORM)
    setPhotoFile(file)
  }

  function fireRareConfetti(): void {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#C9A84C', '#F5C518', '#FFFFFF', '#FFD700', '#3D9A52'],
      scalar: 1.1,
      gravity: 0.9,
      decay: 0.92,
    })
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 120,
        origin: { x: 0.2, y: 0.65 },
        colors: ['#C9A84C', '#F5C518', '#FFFFFF'],
        scalar: 0.9,
        gravity: 1.1,
      })
      confetti({
        particleCount: 60,
        spread: 120,
        origin: { x: 0.8, y: 0.65 },
        colors: ['#C9A84C', '#F5C518', '#FFFFFF'],
        scalar: 0.9,
        gravity: 1.1,
      })
    }, 200)
  }

  async function handleDownload(): Promise<void> {
    const rare = await downloadPNG()
    if (rare) {
      fireRareConfetti()
      toast.success('⭐ Você ganhou uma figurinha rara!')
    } else {
      toast.success('Figurinha baixada com sucesso!')
    }

    const country = getCountryByCode(stampData.countryCode)
    registerParticipant({
      nome: stampData.name,
      email: stampData.email,
      pais: country?.name ?? stampData.countryCode,
      paisCode: stampData.countryCode,
      timestamp: new Date().toISOString(),
      cargo: stampData.role,
      area: stampData.area,
      status: 'completed',
      quizResult: quizResult?.fullLabel ?? '',
    })
  }

  // ── Shared background layer (used in all screens) ────────────────────────
  const sharedBg = (
    <>
      <AppBackground />
      <DecorativeCorners />
      {/* Hidden file input for photo replacement (reused across screens) */}
      <input
        ref={replacePhotoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplaceFileSelected}
      />
    </>
  )

  // ── Tela 1: Landing (email + botão começar quiz) ──────────────────────────
  if (step === 'landing') {
    return (
      <>
        <Toaster position="top-right" />
        {sharedBg}
        <Header />
        <div
          key="screen-landing"
          className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 pt-24 md:pt-28 animate-fade-slide-up"
        >
          <div className="w-full max-w-lg">
            <div className="text-center mb-8">
              <img
                src="/assets/logo-beyondSummit_fonte_preta.png"
                alt="Beyond Summit Innovation Cup"
                className="mx-auto h-20 md:h-24 w-auto object-contain"
              />

              {/* Divider with year badge */}
              <div className="flex items-center gap-3 my-4">
                <div className="h-px flex-1 bg-[#D1D5DB]" />
                <span className="text-xs font-bold text-[#E0C060] tracking-[0.3em] uppercase">2026</span>
                <div className="h-px flex-1 bg-[#D1D5DB]" />
              </div>

              {/* Hero call-to-action */}
              <h1 className="font-display font-extrabold text-4xl md:text-5xl text-[#111111] uppercase tracking-wide leading-none">
                Complete o Quiz e ganhe
              </h1>
              <p className="font-display font-bold text-xl md:text-2xl text-[#2D7A40] uppercase tracking-widest mt-1 leading-tight">
                sua figurinha exclusiva do evento
              </p>
              <p className="mt-4 text-sm font-body text-[#374151] leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            {/* Email field */}
            <div className="mb-6">
              <label
                htmlFor="upload-email"
                className="block text-xs font-semibold font-body uppercase tracking-wider text-[#374151] mb-1.5"
              >
                Email corporativo
                <span className="text-[#EF4444] ml-0.5">*</span>
              </label>
              <div className="flex items-center w-full rounded-[10px] border border-[#D1D5DB] bg-white focus-within:border-[#1A5C2A] focus-within:ring-2 focus-within:ring-[rgba(26,92,42,0.1)] transition-all duration-150 overflow-hidden">
                <input
                  id="upload-email"
                  type="text"
                  value={uploadEmail}
                  onChange={(e) => setUploadEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleStartQuiz() }}
                  placeholder="nome.sobrenome@br"
                  className="flex-1 min-w-0 px-4 py-3 bg-transparent font-body text-base text-[#111111] placeholder:text-[#9CA3AF] focus:outline-none"
                  autoComplete="off"
                />
                <span className="pr-4 font-body text-base text-[#6B7280] select-none whitespace-nowrap">.ey.com</span>
              </div>
              <p className="mt-1.5 flex items-start gap-1.5 text-[13px] font-body text-[#6B7280] leading-snug">
                <span className="shrink-0 mt-px">ℹ️</span>
                Usado apenas para fins internos de mensuração do evento
              </p>
            </div>

            {/* Start quiz button */}
            <button
              type="button"
              onClick={handleStartQuiz}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#1A5C2A] text-white font-display font-bold text-xl uppercase tracking-wide transition-all duration-150 hover:bg-[#144a22] hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A5C2A] focus-visible:ring-offset-2"
            >
              <span className="text-2xl">⚽</span>
              Começar Quiz
            </button>

            <p className="mt-4 text-center text-xs font-body text-[#9CA3AF]">
              5 perguntas rápidas para descobrir qual é a sua posição em campo
            </p>
          </div>
        </div>
      </>
    )
  }

  // ── Tela 2: Quiz (perguntas) ──────────────────────────────────────────────
  if (step === 'quiz') {
    return (
      <>
        <Toaster position="top-right" />
        {sharedBg}
        <Header />
        <div
          key={`screen-quiz-${quizQuestionIndex}`}
          className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 pt-24 md:pt-28"
        >
          <QuizQuestion
            question={QUIZ_QUESTIONS[quizQuestionIndex]}
            totalQuestions={QUIZ_QUESTIONS.length}
            onAnswer={handleQuizAnswer}
          />
        </div>
      </>
    )
  }

  // ── Tela 3: Desempate ─────────────────────────────────────────────────────
  if (step === 'tiebreaker') {
    return (
      <>
        <Toaster position="top-right" />
        {sharedBg}
        <Header />
        <div
          key="screen-tiebreaker"
          className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 pt-24 md:pt-28"
        >
          <div className="w-full max-w-lg mx-auto mb-4 text-center">
            <span className="inline-block text-xs font-bold font-body uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#FBF5E6] text-[#C9A84C]">
              🥅 É Pênalti! Hora do desempate
            </span>
          </div>
          <QuizQuestion
            question={TIEBREAKER_QUESTION}
            totalQuestions={QUIZ_QUESTIONS.length}
            onAnswer={handleQuizAnswer}
          />
        </div>
      </>
    )
  }

  // ── Tela 4: Resultado do Quiz + Upload ────────────────────────────────────
  if (step === 'quiz-result' && quizResult) {
    return (
      <>
        <Toaster position="top-right" />
        {sharedBg}
        <Header />
        <div
          key="screen-quiz-result"
          className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 pt-24 md:pt-28"
        >
          <QuizResultCard
            result={quizResult}
            onFileSelect={handleFileSelect}
            selectedFile={photoFile}
          />
        </div>
      </>
    )
  }

  // ── Tela 5: Loading ───────────────────────────────────────────────────────
  if (step === 'processing') {
    return (
      <>
        <Toaster position="top-right" />
        {sharedBg}
        <Header />
        <div
          key="screen-processing"
          className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 pt-24 md:pt-28 animate-fade-in"
        >
          <div className="w-full max-w-sm text-center space-y-6">
            <h2 className="font-display text-3xl font-bold text-[#111111] uppercase tracking-wide">
              Preparando sua figurinha...
            </h2>
            <div className="w-full bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
              <div className="h-full bg-[#1A5C2A] rounded-full animate-[progress_3s_ease-in-out_infinite]" />
            </div>
            <div className="flex items-center justify-center gap-3 text-[#374151] font-body">
              <Loader2 size={18} className="animate-spin text-[#1A5C2A]" />
              <span className="text-base">{LOADING_MESSAGES[msgIndex]}</span>
            </div>
            <p className="text-sm text-[#9CA3AF] font-body">
              Isso pode levar alguns segundos
            </p>
          </div>
        </div>
      </>
    )
  }

  // ── Tela 6: Ajuste de foto ────────────────────────────────────────────────
  if (step === 'photo-adjust' && processedPhotoUrl) {
    return (
      <>
        <Toaster position="top-right" />
        {sharedBg}
        <Header />
        <div
          key="screen-photo-adjust"
          className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 pt-24 md:pt-28 animate-fade-slide-up"
        >
          <div className="w-full max-w-sm">
            <PhotoAdjustEditor
              photoUrl={processedPhotoUrl}
              onConfirm={handlePhotoAdjustConfirm}
              onSkip={handlePhotoAdjustSkip}
              onReplacePhoto={handleReplacePhoto}
            />
          </div>
        </div>
      </>
    )
  }

  // ── Tela 7: Editor ────────────────────────────────────────────────────────
  return (
    <>
      <Toaster position="top-right" />
      {sharedBg}
      <Header />
      <div
        key="screen-editor"
        className="relative z-10 min-h-screen p-4 pt-20 md:p-6 md:pt-24 lg:p-10 lg:pt-28 animate-slide-in-right"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 items-start">
            {/* StampCanvas — live figurinha preview */}
            <div className="w-full md:w-[280px] lg:w-[380px] shrink-0 animate-scale-reveal">
              <StampCanvas
                canvasRef={canvasRef}
                isComposing={isComposing}
                photoUrl={processedPhotoUrl}
                isRare={isRare || forceRare}
              />
              {/* Re-adjust button */}
              <button
                type="button"
                onClick={() => setPhotoAdjusted(false)}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-[8px] border border-[#D1D5DB] text-[#374151] font-body text-xs font-medium hover:bg-[#F5F5F5] transition-all duration-150"
              >
                ✦ Reajustar posição da foto
              </button>
              {/* Replace photo button */}
              <button
                type="button"
                onClick={handleReplacePhoto}
                className="mt-1.5 w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-[8px] border border-[#D1D5DB] text-[#374151] font-body text-xs font-medium hover:bg-[#F5F5F5] transition-all duration-150"
              >
                📷 Subir outra foto
              </button>
              {/* Force-rare toggle — test button, remove after validation */}
              <button
                  type="button"
                  onClick={() => {
                    const next = !forceRare
                    setForceRare(next)
                    if (next) fireRareConfetti()
                  }}
                  className={`mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-[8px] border font-body text-xs font-medium transition-all duration-150 ${
                    forceRare
                      ? 'bg-[#C9A84C] border-[#C9A84C] text-white'
                      : 'border-[#C9A84C] text-[#C9A84C] hover:bg-[#FBF5E6]'
                  }`}
                 >
                  ⭐ {forceRare ? 'Figurinha rara ativada' : 'Ver figurinha rara (teste)'}
                </button>
            </div>

            {/* Form */}
            <div className="flex-1 min-w-0">
              <StampForm
                value={stampData}
                onChange={setStampData}
                onDownload={handleDownload}
                onReset={handleReset}
                isDownloadEnabled={isStampComplete(stampData)}
                quizResult={quizResult}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
