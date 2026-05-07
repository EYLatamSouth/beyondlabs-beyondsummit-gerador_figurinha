import { useRef, useState, useEffect, useCallback } from 'react'
import type { RefObject } from 'react'
import type { StampData, PhotoTransform } from '@/types/stamp'
import { DEFAULT_PHOTO_TRANSFORM } from '@/types/stamp'
import { composeLayers, exportPNG } from '@/lib/canvas'
import { rollRarity } from '@/lib/rarity'

interface UseStampCanvasReturn {
  canvasRef: RefObject<HTMLCanvasElement>
  isComposing: boolean
  isRare: boolean
  downloadPNG: () => Promise<boolean>
}

export function useStampCanvas(
  stampData: StampData,
  photoUrl: string | null,
  photoTransform: PhotoTransform = DEFAULT_PHOTO_TRANSFORM,
  forceRare = false,
): UseStampCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null) as RefObject<HTMLCanvasElement>
  const [isComposing, setIsComposing] = useState(false)
  const [isRare, setIsRare] = useState(false)

  // Canvas preview reflects only forceRare. isRare is exclusively set during
  // downloadPNG for the toast return value — it does NOT re-trigger composition
  // to avoid double-compose and stale "rare" preview after forceRare is toggled off.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !photoUrl) return

    setIsComposing(true)
    composeLayers(canvas, stampData, photoUrl, photoTransform, forceRare)
      .catch((err) => console.error('[useStampCanvas] composeLayers error:', err))
      .finally(() => setIsComposing(false))
  }, [stampData, photoUrl, photoTransform, forceRare])

  // Reset rare badge state whenever forceRare is toggled off
  useEffect(() => {
    if (!forceRare) setIsRare(false)
  }, [forceRare])

  // Returns true if the downloaded sticker is rare (for toast feedback).
  // Explicitly re-composes with the rare template before exporting when needed.
  const downloadPNG = useCallback(async (): Promise<boolean> => {
    const canvas = canvasRef.current
    if (!canvas) return false

    const rare = forceRare || rollRarity()
    setIsRare(rare)

    // Always compose immediately before export to capture the correct template.
    await composeLayers(canvas, stampData, photoUrl!, photoTransform, rare)
    exportPNG(canvas, 'figurinha_beyondsummit2026.png')
    return rare
  }, [forceRare, stampData, photoUrl, photoTransform])

  return { canvasRef, isComposing, isRare, downloadPNG }
}
