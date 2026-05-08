import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { UploadZone } from '@/components/UploadZone'
import { StampForm } from '@/components/StampForm'
import { StampCanvas } from '@/components/StampCanvas'
import { PhotoAdjustEditor } from '@/components/PhotoAdjustEditor'
import { Header } from '@/components/Header'
import { DecorativeCorners } from '@/components/DecorativeCorners'
import { AppBackground } from '@/components/AppBackground'
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval'
import { useStampCanvas } from '@/hooks/useStampCanvas'
import { registerParticipant } from '@/lib/analytics'
import { getCountryByCode } from '@/lib/countries'
import type { StampData, PhotoTransform } from '@/types/stamp'
import { DEFAULT_PHOTO_TRANSFORM } from '@/types/stamp'


const EMPTY_STAMP: StampData = {
  name: '',
  role: '',
  area: '',
  email: '',
  countryCode: '',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LOADING_MESSAGES = [
  'Analisando sua foto...',
  'Removendo o fundo...',
  'Quase lá...',
]

function isStampComplete(data: StampData): boolean {
  return (
    data.name.trim() !== '' &&
    data.role.trim() !== '' &&
    data.area.trim() !== '' &&
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

  const {
    status,
    processedUrl: processedPhotoUrl,
    processFile,
    reset,
  } = useBackgroundRemoval()

  const { canvasRef, isComposing, isRare, downloadPNG } = useStampCanvas(stampData, processedPhotoUrl, photoTransform, forceRare)

  const step =
    !photoFile || status === 'idle' ? 'upload'
    : status === 'processing' ? 'processing'
    : status === 'done' && !photoAdjusted ? 'photo-adjust'
    : 'editor'

  useEffect(() => {
    if (photoFile) {
      processFile(photoFile)
    }
  }, [photoFile]) // eslint-disable-line react-hooks/exhaustive-deps

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
    reset()
  }

  function handlePhotoAdjustConfirm(transform: PhotoTransform): void {
    setPhotoTransform(transform)
    setPhotoAdjusted(true)
  }

  function handlePhotoAdjustSkip(): void {
    setPhotoAdjusted(true)
  }

  function handleFileSelect(file: File): void {
    if (!uploadEmail.trim() || !EMAIL_REGEX.test(uploadEmail.trim())) {
      toast.error('Informe um email válido antes de enviar a foto.')
      return
    }
    setStampData((prev) => ({ ...prev, email: uploadEmail.trim() }))
    setPhotoFile(file)
  }

  async function handleDownload(): Promise<void> {
    const rare = await downloadPNG()
    if (rare) {
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
    })
  }

  // ── Shared background layer (used in all screens) ────────────────────────
  const sharedBg = (
    <>
      <AppBackground />
      <DecorativeCorners />
    </>
  )

  // ── Tela 1: Upload ────────────────────────────────────────────────────────
  if (step === 'upload') {
    return (
      <>
        <Toaster position="top-right" />
        {sharedBg}
        <Header />
        <div
          key="screen-upload"
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
                Crie sua figurinha
              </h1>
              <p className="font-display font-bold text-xl md:text-2xl text-[#2D7A40] uppercase tracking-widest mt-1 leading-tight">
                exclusiva do evento
              </p>
            </div>
            {/* Email capture — required before upload */}
            <div className="mb-4">
              <label
                htmlFor="upload-email"
                className="block text-xs font-semibold font-body uppercase tracking-wider text-[#374151] mb-1.5"
              >
                Email corporativo
                <span className="text-[#EF4444] ml-0.5">*</span>
              </label>
              <input
                id="upload-email"
                type="email"
                value={uploadEmail}
                onChange={(e) => setUploadEmail(e.target.value)}
                placeholder="seu.email@ey.com"
                className={[
                  'w-full px-4 py-3 rounded-[10px] border border-[#D1D5DB] bg-white',
                  'font-body text-base text-[#111111] placeholder:text-[#9CA3AF]',
                  'focus:outline-none focus:border-[#1A5C2A] focus:ring-2 focus:ring-[rgba(26,92,42,0.1)]',
                  'transition-all duration-150',
                ].join(' ')}
                autoComplete="email"
              />
              <p className="mt-1.5 flex items-start gap-1.5 text-[13px] font-body text-[#6B7280] leading-snug">
                <span className="shrink-0 mt-px">ℹ️</span>
                Usado apenas para fins internos de mensuração do evento
              </p>
            </div>
            <UploadZone onFileSelect={handleFileSelect} selectedFile={photoFile} />
            <p className="mt-4 text-center text-sm font-body text-[#6B7280]">
              Use uma foto com fundo neutro e rosto centralizado para melhor resultado
            </p>
          </div>
        </div>
      </>
    )
  }

  // ── Tela 2: Loading ───────────────────────────────────────────────────────
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

  // ── Tela 3: Ajuste de foto ────────────────────────────────────────────────
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
            />
          </div>
        </div>
      </>
    )
  }

  // ── Tela 4: Editor ────────────────────────────────────────────────────────
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
              {/* Force-rare toggle — MVP test button (dev only) */}
              {import.meta.env.DEV && (
                <button
                  type="button"
                  onClick={() => setForceRare((v) => !v)}
                  className={`mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-[8px] border font-body text-xs font-medium transition-all duration-150 ${
                    forceRare
                      ? 'bg-[#C9A84C] border-[#C9A84C] text-white'
                      : 'border-[#C9A84C] text-[#C9A84C] hover:bg-[#FBF5E6]'
                  }`}
                >
                  ⭐ {forceRare ? 'Figurinha rara ativada' : 'Ver figurinha rara (teste)'}
                </button>
              )}
            </div>

            {/* Form */}
            <div className="flex-1 min-w-0">
              <StampForm
                value={stampData}
                onChange={setStampData}
                onDownload={handleDownload}
                onReset={handleReset}
                isDownloadEnabled={isStampComplete(stampData)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
