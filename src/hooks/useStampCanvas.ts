import { useRef, useState, useEffect, useCallback } from 'react'
import type { RefObject } from 'react'
import type { StampData } from '@/types/stamp'
import { composeLayers, exportPNG } from '@/lib/canvas'

interface UseStampCanvasReturn {
  canvasRef: RefObject<HTMLCanvasElement>
  isComposing: boolean
  downloadPNG: () => void
}

export function useStampCanvas(
  stampData: StampData,
  photoUrl: string | null,
): UseStampCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null) as RefObject<HTMLCanvasElement>
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !photoUrl) return

    setIsComposing(true)
    composeLayers(canvas, stampData, photoUrl)
      .catch((err) => console.error('[useStampCanvas] composeLayers error:', err))
      .finally(() => setIsComposing(false))
  }, [stampData, photoUrl])

  const downloadPNG = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    exportPNG(canvas, 'figurinha_beyondsummit2026.png')
  }, [])

  return { canvasRef, isComposing, downloadPNG }
}
