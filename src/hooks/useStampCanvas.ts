import { useState, useEffect, useCallback } from 'react'
import type { StampData, PhotoTransform } from '@/types/stamp'
import { DEFAULT_PHOTO_TRANSFORM } from '@/types/stamp'
import { composeLayers, exportPNG } from '@/lib/canvas'
import { rollRarity } from '@/lib/rarity'

interface UseStampCanvasReturn {
  canvasRef: (el: HTMLCanvasElement | null) => void
  isComposing: boolean
  isRare: boolean
  downloadPNG: () => Promise<boolean>
}

export function useStampCanvas(
  stampData: StampData,
  photoUrl: string | null,
  photoTransform: PhotoTransform = DEFAULT_PHOTO_TRANSFORM,
  forceRare = false,
  namePlaceholder = 'NOME AQUI',
): UseStampCanvasReturn {
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null)
  const [isComposing, setIsComposing] = useState(false)
  const [isRare, setIsRare] = useState(false)

  // Callback ref: triggers state update when canvas mounts/unmounts,
  // ensuring composition runs as soon as the canvas element is in the DOM.
  const canvasRef = useCallback((el: HTMLCanvasElement | null) => {
    setCanvasEl(el)
  }, [])

  // Canvas preview reflects only forceRare. isRare is exclusively set during
  // downloadPNG for the toast return value — it does NOT re-trigger composition
  // to avoid double-compose and stale "rare" preview after forceRare is toggled off.
  useEffect(() => {
    if (!canvasEl || !photoUrl) return

    setIsComposing(true)
    composeLayers(canvasEl, stampData, photoUrl, photoTransform, forceRare, namePlaceholder)
      .catch((err) => console.error('[useStampCanvas] composeLayers error:', err))
      .finally(() => setIsComposing(false))
  }, [canvasEl, stampData, photoUrl, photoTransform, forceRare])

  // Reset rare badge state whenever forceRare is toggled off
  useEffect(() => {
    if (!forceRare) setIsRare(false)
  }, [forceRare])

  // Returns true if the downloaded sticker is rare (for toast feedback).
  // Explicitly re-composes with the rare template before exporting when needed.
  const downloadPNG = useCallback(async (): Promise<boolean> => {
    if (!canvasEl) return false

    const rare = forceRare || rollRarity()
    setIsRare(rare)

    // Always compose immediately before export to capture the correct template.
    await composeLayers(canvasEl, stampData, photoUrl!, photoTransform, rare, namePlaceholder)
    exportPNG(canvasEl, 'figurinha_beyondsummit2026.png')
    return rare
  }, [canvasEl, forceRare, stampData, photoUrl, photoTransform])

  return { canvasRef, isComposing, isRare, downloadPNG }
}
