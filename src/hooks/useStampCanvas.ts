import { useRef, useState, useEffect, useCallback } from 'react'
import type { RefObject } from 'react'
import type { StampData, PhotoTransform } from '@/types/stamp'
import { DEFAULT_PHOTO_TRANSFORM } from '@/types/stamp'
import { composeLayers, exportPNG } from '@/lib/canvas'

interface UseStampCanvasReturn {
  canvasRef: RefObject<HTMLCanvasElement>
  isComposing: boolean
  downloadPNG: () => void
}

export function useStampCanvas(
  stampData: StampData,
  photoUrl: string | null,
  photoTransform: PhotoTransform = DEFAULT_PHOTO_TRANSFORM,
): UseStampCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null) as RefObject<HTMLCanvasElement>
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !photoUrl) return

    setIsComposing(true)
    composeLayers(canvas, stampData, photoUrl, photoTransform)
      .catch((err) => console.error('[useStampCanvas] composeLayers error:', err))
      .finally(() => setIsComposing(false))
  }, [stampData, photoUrl, photoTransform])

  const downloadPNG = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    exportPNG(canvas, 'figurinha_beyondsummit2026.png')
  }, [])

  return { canvasRef, isComposing, downloadPNG }
}
