import React from 'react'
import { Loader2 } from 'lucide-react'

interface StampCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  isComposing: boolean
  photoUrl: string | null
  isRare?: boolean
}

export function StampCanvas({ canvasRef, isComposing, photoUrl, isRare = false }: StampCanvasProps) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Card wrapper — maintains 3:4 aspect ratio */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.18)] bg-white">
        {/* 3:4 aspect-ratio enforcer */}
        <div className="w-full" style={{ aspectRatio: '3 / 4' }}>
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

        {/* Rare sticker badge */}
        {isRare && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#C9A84C] text-white text-xs font-bold font-display uppercase tracking-wide px-3 py-1.5 rounded-full shadow-lg">
            ⭐ Figurinha Rara!
          </div>
        )}

        {/* Composing overlay */}
        {isComposing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
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
