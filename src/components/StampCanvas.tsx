import { Loader2 } from 'lucide-react'
import { RareStampEffects } from '@/components/RareStampEffects'

interface StampCanvasProps {
  canvasRef: (el: HTMLCanvasElement | null) => void
  isComposing: boolean
  photoUrl: string | null
  isRare?: boolean
}

export function StampCanvas({ canvasRef, isComposing, photoUrl, isRare = false }: StampCanvasProps) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Rare sticker badge — animated bounce when rare */}
      {isRare && (
        <div className="flex justify-center mb-2">
          <div className="flex items-center gap-1.5 bg-[#C9A84C] text-white text-xs font-bold font-display uppercase tracking-wide px-4 py-1.5 rounded-full shadow-md animate-rare-badge-bounce">
            ⭐ Figurinha Rara!
          </div>
        </div>
      )}

      {/* Card wrapper — maintains 3:4 aspect ratio + rare glow */}
      <div
        className={[
          'relative w-full rounded-2xl overflow-visible bg-white',
          isRare
            ? 'shadow-[0_8px_32px_rgba(0,0,0,0.18)] animate-rare-glow-pulse'
            : 'shadow-[0_8px_32px_rgba(0,0,0,0.18)]',
        ].join(' ')}
      >
        {/* Sparkles + shimmer sit here (overflow:visible on parent allows sparkles to bleed out) */}
        <RareStampEffects visible={isRare} />

        {/* Inner clip for the canvas/content — separate div keeps overflow:hidden for shimmer */}
        <div className="w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
          {photoUrl ? (
            /* Real canvas — CSS-scaled to fill container */
            <canvas
              ref={canvasRef}
              width={900}
              height={1200}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          ) : (
            /* Empty state */
            <div className="w-full h-full bg-[#F0FDF4] flex flex-col items-center justify-center gap-3 px-6">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#7DC48A] flex items-center justify-center">
                <span className="text-xl">⚽</span>
              </div>
              <p className="font-body text-sm text-[#9CA3AF] text-center leading-snug">
                Aguardando foto...
              </p>
            </div>
          )}
        </div>

        {/* Composing overlay */}
        {isComposing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl">
            <Loader2 size={32} className="animate-spin text-[#3D9A52]" />
            <p className="font-body text-white text-sm font-medium mt-2">
              Renderizando...
            </p>
          </div>
        )}
      </div>

      {/* Label */}
      <p className="font-body text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mt-2">
        Preview
      </p>
    </div>
  )
}
