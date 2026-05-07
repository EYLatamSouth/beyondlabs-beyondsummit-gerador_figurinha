import { useRef, useState, useEffect, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { Camera, UploadCloud, CheckCircle2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Formato não suportado. Use JPG ou PNG.'
  }
  if (file.size > MAX_SIZE_BYTES) {
    return 'Arquivo muito grande. Use uma foto de até 5MB.'
  }
  return null
}

export function UploadZone({ onFileSelect, selectedFile }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Generate preview URL and revoke on cleanup
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [selectedFile])

  const handleFile = useCallback(
    (file: File) => {
      const error = validateFile(file)
      if (error) {
        toast.error(error)
        return
      }
      onFileSelect(file)
    },
    [onFileSelect],
  )

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset input so the same file can be re-selected
    e.target.value = ''
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  // ─── Selected state ───────────────────────────────────────────────────────
  if (selectedFile && previewUrl) {
    return (
      <div
        className="relative flex flex-col items-center gap-3 rounded-[20px] border-2 border-solid p-6 transition-all duration-200"
        style={{ borderColor: '#3D9A52', backgroundColor: '#F0FDF4' }}
      >
        {/* Thumbnail */}
        <div className="relative">
          <div className="overflow-hidden rounded-xl" style={{ width: 120, height: 120 }}>
            <img
              src={previewUrl}
              alt="Preview da foto selecionada"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Checkmark badge */}
          <span
            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: '#1A5C2A' }}
          >
            <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={2.5} />
          </span>
        </div>

        {/* File name */}
        <p
          className="max-w-[200px] truncate text-center text-sm font-medium"
          style={{ color: '#374151' }}
          title={selectedFile.name}
        >
          {selectedFile.name}
        </p>

        {/* Change photo button */}
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-white"
          style={{ color: '#3D9A52' }}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Trocar foto
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handleChange}
          aria-label="Selecionar foto"
        />
      </div>
    )
  }

  // ─── Idle / Drag-over state ───────────────────────────────────────────────
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Área de upload de foto. Clique ou arraste uma imagem."
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick()
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-4 rounded-[20px] border-2 border-dashed transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        borderColor: isDragOver ? '#C9A84C' : '#3D9A52',
        backgroundColor: isDragOver ? '#FFFBEB' : '#F0FDF4',
        transform: isDragOver ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* Animated border pulse on drag-over */}
      {isDragOver && (
        <span
          className="pointer-events-none absolute inset-0 animate-ping rounded-[20px] border-2 opacity-30"
          style={{ borderColor: '#C9A84C' }}
          aria-hidden="true"
        />
      )}

      {/* Icon */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200"
        style={{
          backgroundColor: isDragOver ? '#C9A84C' : '#3D9A52',
        }}
      >
        {isDragOver ? (
          <UploadCloud className="h-8 w-8 text-white" strokeWidth={1.75} />
        ) : (
          <Camera className="h-8 w-8 text-white" strokeWidth={1.75} />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-1 text-center">
        <p
          className="text-xl font-bold leading-tight tracking-wide"
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            color: isDragOver ? '#92400E' : '#1A5C2A',
          }}
        >
          {isDragOver ? 'Solte a foto aqui' : 'Arraste sua foto aqui'}
        </p>
        {!isDragOver && (
          <p className="text-sm" style={{ color: '#374151' }}>
            ou clique para selecionar
          </p>
        )}
      </div>

      {/* Format hint */}
      {!isDragOver && (
        <span
          className="rounded-full px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: '#DCFCE7', color: '#166534' }}
        >
          JPG ou PNG · até 5MB
        </span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleChange}
        aria-label="Selecionar foto"
      />
    </div>
  )
}

export default UploadZone
