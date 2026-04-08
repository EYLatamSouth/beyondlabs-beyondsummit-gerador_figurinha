import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { UploadZone } from '@/components/UploadZone'
import { StampForm } from '@/components/StampForm'
import { StampCanvas } from '@/components/StampCanvas'
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval'
import { useStampCanvas } from '@/hooks/useStampCanvas'
import type { StampData } from '@/types/stamp'

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
    data.role.trim() !== '' &&
    data.area.trim() !== '' &&
    data.email.trim() !== '' &&
    data.countryCode !== ''
  )
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [stampData, setStampData] = useState<StampData>(EMPTY_STAMP)
  const [msgIndex, setMsgIndex] = useState(0)
  const { status, processedUrl, processFile, reset } = useBackgroundRemoval()
  const { canvasRef, isComposing, downloadPNG } = useStampCanvas(stampData, processedUrl)

  // Auto-process when a file is selected
  useEffect(() => {
    if (selectedFile) {
      processFile(selectedFile)
    }
  }, [selectedFile]) // eslint-disable-line react-hooks/exhaustive-deps

  // Rotate loading messages
  useEffect(() => {
    if (status !== 'processing') return
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 1800)
    return () => clearInterval(id)
  }, [status])

  function handleReset(): void {
    setSelectedFile(null)
    setStampData(EMPTY_STAMP)
    reset()
  }

  function handleDownload(): void {
    downloadPNG()
    toast.success('Figurinha baixada com sucesso!')
  }

  function handleShare(): void {
    const text = encodeURIComponent(
      'Acabei de criar minha figurinha do Beyond Summit Innovation Cup 2026! ⚽🏆 #BeyondSummit2026 #EY',
    )
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fbeyondsummit.ey.com&summary=${text}`, '_blank')
  }

  // ── Tela 1: Upload ────────────────────────────────────────────────────────
  if (!selectedFile || status === 'idle') {
    return (
      <>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-lg">
            <div className="text-center mb-8">
              <h1 className="font-display text-5xl font-extrabold text-[#111111] uppercase tracking-wide leading-none">
                Beyond Summit
              </h1>
              <p className="font-display text-2xl font-bold text-[#1A5C2A] uppercase tracking-widest mt-1">
                Innovation Cup 2026
              </p>
              <p className="font-body text-base text-[#374151] mt-3">
                Crie sua figurinha exclusiva do evento ⚽
              </p>
            </div>
            <UploadZone onFileSelect={setSelectedFile} selectedFile={selectedFile} />
            <p className="mt-4 text-center text-sm font-body text-[#6B7280]">
              💡 Use uma foto com fundo neutro e rosto centralizado para melhor resultado
            </p>
          </div>
        </div>
      </>
    )
  }

  // ── Tela 2: Loading ───────────────────────────────────────────────────────
  if (status === 'processing') {
    return (
      <>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
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

  // ── Tela 3: Editor ────────────────────────────────────────────────────────
  if (status === 'done' || status === 'error') {
    return (
      <>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-white p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8 pb-4 border-b border-[#E5E7EB]">
              <p className="font-display text-sm font-bold text-[#1A5C2A] uppercase tracking-[0.2em]">
                Beyond Summit Innovation Cup 2026
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              {/* StampCanvas — live figurinha preview */}
              <div className="w-full lg:w-[380px] shrink-0">
                <StampCanvas
                  canvasRef={canvasRef}
                  isComposing={isComposing}
                  photoUrl={processedUrl}
                />
              </div>

              {/* Form */}
              <div className="flex-1 min-w-0">
                <StampForm
                  value={stampData}
                  onChange={setStampData}
                  onDownload={handleDownload}
                  onShare={handleShare}
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

  return null
}
